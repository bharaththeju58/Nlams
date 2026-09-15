import { GoogleGenAI } from '@google/genai';
import express from 'express';
import { 
  NLAMS_DATASET_INFO, 
  projects, 
  landParcels, 
  compensation, 
  rehabilitation, 
  possession, 
  verification 
} from './sampleDataset';

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI(process.env.GEMINI_API_KEY ? { apiKey: process.env.GEMINI_API_KEY } : {});
  }
  return aiClient;
}

const router = express.Router();

function retrieveNLAMSData(question: string) {
    const q = question.toLowerCase();
    
    let matchedParcelIds = new Set<string>();
    let matchedProjectIds = new Set<string>();
    let calculatedResult: string | null = null;
    let isCountQuery = q.includes("how many") || q.includes("count") || q.includes("total affected") || q.includes("total land");
    let isSumQuery = q.includes("total") || q.includes("sum");
    let isHighestQuery = q.includes("highest") || q.includes("most");
    let isListQuery = q.includes("list") || q.includes("which parcels") || q.includes("which owners") || q.includes("which project") || q.includes("who owns");
    let isPercentageQuery = q.includes("percentage");
    let isDifferenceQuery = q.includes("difference");

    // Extract explicit IDs
    const parcelMatches = Array.from(new Set(question.match(/(?:LP-\d{3,}|PAR-[A-Z]+-\d{4,})/gi) || [])).map(id => id.toUpperCase());
    const projectMatches = Array.from(new Set(question.match(/(?:PRJ-\d{4}-\d{4,}|NLAMS-PRJ-\d{3,})/gi) || [])).map(id => id.toUpperCase().replace('NLAMS-', 'NLAMS-'));
    
    parcelMatches.forEach(id => matchedParcelIds.add(id));
    projectMatches.forEach(id => matchedProjectIds.add(id));

    // Owner Name Match
    landParcels.forEach(p => {
        if (q.includes(p.ownerName.toLowerCase())) {
            matchedParcelIds.add(p.parcelId);
        }
    });

    // Project Type / Dept Match
    projects.forEach(p => {
        if (q.includes(p.projectType.toLowerCase()) || q.includes(p.department.toLowerCase())) {
            matchedProjectIds.add(p.projectId);
        }
    });

    // Query Conditions
    let filteredParcels = [...landParcels];
    let filteredProjects = [...projects];
    let conditionApplied = false;

    if (q.includes("pending compensation") || q.includes("compensation is pending")) {
        const pendingCompIds = compensation.filter(c => c.compensationStatus.toLowerCase() === "pending" || c.pendingAmount > 0).map(c => c.parcelId);
        filteredParcels = filteredParcels.filter(p => pendingCompIds.includes(p.parcelId));
        conditionApplied = true;
    }
    
    if (q.includes("partially paid") || q.includes("partially paid compensation")) {
        const partiallyPaidIds = compensation.filter(c => c.paymentStatus.toLowerCase() === "partially paid").map(c => c.parcelId);
        filteredParcels = filteredParcels.filter(p => partiallyPaidIds.includes(p.parcelId));
        conditionApplied = true;
    }

    if (q.includes("completely paid") || q.includes("fully paid") || q.includes("fully received") || q.includes("paid compensation")) {
        const fullyPaidIds = compensation.filter(c => c.paymentStatus.toLowerCase() === "completed").map(c => c.parcelId);
        filteredParcels = filteredParcels.filter(p => fullyPaidIds.includes(p.parcelId));
        conditionApplied = true;
    }
    
    if (q.includes("no compensation") || q.includes("not assessed")) {
        const noCompIds = compensation.filter(c => c.paymentStatus.toLowerCase() === "not initiated" || c.compensationStatus.toLowerCase() === "not assessed").map(c => c.parcelId);
        filteredParcels = filteredParcels.filter(p => noCompIds.includes(p.parcelId));
        conditionApplied = true;
    }

    if (q.includes("completed possession") || q.includes("possession completed")) {
        const completedPossIds = possession.filter(pos => pos.possessionStatus.toLowerCase() === "completed").map(pos => pos.parcelId);
        filteredParcels = filteredParcels.filter(p => completedPossIds.includes(p.parcelId));
        conditionApplied = true;
    }

    if (q.includes("verified")) {
        const verifiedIds = verification.filter(v => v.verificationStatus.toLowerCase() === "verified").map(v => v.parcelId);
        filteredParcels = filteredParcels.filter(p => verifiedIds.includes(p.parcelId));
        conditionApplied = true;
    }

    if (q.includes("salem")) {
        filteredParcels = filteredParcels.filter(p => p.district.toLowerCase() === "salem");
        conditionApplied = true;
    }
    
    if (q.includes("nlams-prj-001")) {
        filteredParcels = filteredParcels.filter(p => p.projectId === "NLAMS-PRJ-001");
        filteredProjects = filteredProjects.filter(p => p.projectId === "NLAMS-PRJ-001");
        conditionApplied = true;
    }
    if (q.includes("nlams-prj-002")) {
        filteredParcels = filteredParcels.filter(p => p.projectId === "NLAMS-PRJ-002");
        filteredProjects = filteredProjects.filter(p => p.projectId === "NLAMS-PRJ-002");
        conditionApplied = true;
    }

    // Apply conditions
    if (conditionApplied && !isCountQuery && !isSumQuery && !isHighestQuery && !isDifferenceQuery && !isPercentageQuery) {
        filteredParcels.forEach(p => matchedParcelIds.add(p.parcelId));
        filteredProjects.forEach(p => matchedProjectIds.add(p.projectId));
    }

    // Aggregations
    if (isHighestQuery && q.includes("pending compensation")) {
        const highestPending = [...compensation].sort((a, b) => b.pendingAmount - a.pendingAmount)[0];
        if (highestPending) matchedParcelIds.add(highestPending.parcelId);
    } else if (isHighestQuery && q.includes("compensation amount")) {
        const highestComp = [...compensation].sort((a, b) => b.approvedAmount - a.approvedAmount)[0];
        if (highestComp) matchedParcelIds.add(highestComp.parcelId);
    } else if (conditionApplied && isCountQuery && !q.includes("parcels belong to") && !q.includes("parcels under")) {
        calculatedResult = `Calculated Count: There are ${filteredParcels.length} parcels matching the criteria.`;
    } else if (isCountQuery && (q.includes("parcels belong to") || q.includes("parcels under"))) {
         // It's just asking how many parcels are in the DB for that project.
         if(matchedProjectIds.size > 0) {
            // We just let the project data fall through, the project data has `totalAffectedParcels`.
         } else {
            calculatedResult = `Calculated Count: There are ${filteredParcels.length} parcels matching the criteria in the sample dataset.`;
         }
    } else if (q.includes("total pending compensation")) {
        const total = compensation.reduce((acc, c) => acc + c.pendingAmount, 0);
        calculatedResult = `Calculated Total: The total pending compensation is ₹${total.toLocaleString('en-IN')}.`;
    } else if (q.includes("total approved compensation")) {
        const total = compensation.reduce((acc, c) => acc + c.approvedAmount, 0);
        calculatedResult = `Calculated Total: The total approved compensation is ₹${total.toLocaleString('en-IN')}.`;
    } else if (isPercentageQuery && parcelMatches.length === 1) {
        const comp = compensation.find(c => c.parcelId === parcelMatches[0]);
        if (comp && comp.approvedAmount > 0) {
            const percentage = ((comp.paidAmount / comp.approvedAmount) * 100).toFixed(2);
            calculatedResult = `Calculated Percentage: ${percentage}% of the compensation for ${parcelMatches[0]} has been paid.`;
        }
    } else if (isDifferenceQuery && q.includes("approved and paid") && parcelMatches.length === 1) {
        const comp = compensation.find(c => c.parcelId === parcelMatches[0]);
        if (comp) {
            const diff = comp.approvedAmount - comp.paidAmount;
            calculatedResult = `Calculated Difference: The difference between approved and paid compensation for ${parcelMatches[0]} is ₹${diff.toLocaleString('en-IN')}.`;
        }
    }

    // Always include project if they ask "which project does LP-xxx belong to"
    if ((q.includes("which project") || q.includes("what project")) && parcelMatches.length > 0) {
        parcelMatches.forEach(id => {
            const parcel = landParcels.find(p => p.parcelId === id);
            if (parcel) {
                matchedProjectIds.add(parcel.projectId);
            }
        });
    }

    // Prepare Context
    let context = "";
    let dataTitles = new Set<string>();

    if (calculatedResult) {
        context += `[Source: Calculated Result, Page: Database]\n${calculatedResult}\n\n`;
        dataTitles.add("Calculated Result");
    }

    matchedParcelIds.forEach(id => {
        const p = landParcels.find(x => x.parcelId === id);
        const comp = compensation.find(x => x.parcelId === id);
        const rehab = rehabilitation.find(x => x.parcelId === id);
        const poss = possession.find(x => x.parcelId === id);
        const ver = verification.find(x => x.parcelId === id);

        if (p) {
            dataTitles.add(`Parcel: ${p.parcelId}`);
            context += `[Source: Parcel: ${p.parcelId}, Page: Database]
Project ID: ${p.projectId}
Survey Number: ${p.surveyNumber}
District: ${p.district}
Village: ${p.village}
Owner Name: ${p.ownerName}
Land Area: ${p.landArea} Acres
Land Type: ${p.landType}
${ver ? `Verification Status: ${ver.verificationStatus}` : ''}
${ver && ver.pendingReason ? `Verification Pending Reason: ${ver.pendingReason}` : ''}
${comp ? `Compensation Status: ${comp.compensationStatus}
Compensation Approved Amount: ₹${comp.approvedAmount}
Amount Paid: ₹${comp.paidAmount}
Amount Pending: ₹${comp.pendingAmount}` : ''}
${rehab ? `Rehabilitation Status: ${rehab.rehabilitationStatus}` : ''}
${poss ? `Possession Status: ${poss.possessionStatus}
${poss.possessionDate ? `Possession Date: ${poss.possessionDate}` : ''}
${poss.pendingReason ? `Possession Pending Reason: ${poss.pendingReason}` : ''}` : ''}
\n`;
        }
    });

    matchedProjectIds.forEach(id => {
        const proj = projects.find(x => x.projectId === id);
        if (proj) {
            dataTitles.add(`Project: ${proj.projectId}`);
            context += `[Source: Project: ${proj.projectId}, Page: Database]
Name: ${proj.projectName}
Type: ${proj.projectType}
Department: ${proj.department}
State: ${proj.state}
District: ${proj.district}
Status: ${proj.status}
Total Affected Parcels: ${proj.totalAffectedParcels}
Verified Parcels: ${proj.verifiedParcels}
Pending Verification: ${proj.pendingVerification}
Total Land Area: ${proj.totalLandArea} Acres
Total Landowners: ${proj.totalLandowners}\n\n`;
        }
    });

    return {
        context: context.trim(),
        sources: Array.from(dataTitles).map(title => ({ title, page: 'Database' }))
    };
}

router.post('/api/chat', async (req, res) => {
  try {
    const { question, message, history, portalUserType } = req.body;
    const query = question || message;
    
    console.log(`[NLAMS AI] User Question: ${query}`);
    
    // Role verification: ONLY Government Officers and Auditors can use the AI Assistant.
    if (portalUserType !== 'officer' && portalUserType !== 'auditor') {
      console.log(`[NLAMS AI ERROR] stage: Authentication, message: Unauthorized access attempt by ${portalUserType}`);
      return res.status(403).json({ error: 'Forbidden', details: 'You are not authorized to use the NLAMS AI Assistant.' });
    }
    
    const { context, sources } = retrieveNLAMSData(query);
    
    console.log(`[NLAMS AI] Retrieved Record Count: ${sources.length}`);
    
    // DO NOT CALL GEMINI IF RETRIEVAL FAILS
    if (!context || context.length === 0) {
      console.log(`[NLAMS AI] No data found in records.`);
      return res.json({
        answer: "I couldn't find this information in the available NLAMS records.",
        sources: []
      });
    }

    console.log(`[NLAMS AI] Gemini Context:\n${context}`);
    
    const systemInstructionText = `
You are the NLAMS AI Assistant.
You answer questions about the National Land Acquisition & Management System.

IMPORTANT RULES:
1. Answer using ONLY the NLAMS CONTEXT provided to you.
2. Never invent information.
3. Never guess missing information.
4. Do not use general knowledge to create NLAMS records.
5. If the answer is not present in the provided context, say:
   "I couldn't find this information in the available NLAMS records."
6. Give a clear and concise answer.
7. If numerical results are provided by the retrieval layer, use those results exactly.
8. Do not change IDs, names, amounts, dates, or statuses.

NLAMS CONTEXT:
${context}
`;
    
    console.log(`[NLAMS AI] Gemini Request Started`);
    const response = await getAI().models.generateContent({
      model: 'gemini-3.6-flash',
      config: { 
        systemInstruction: systemInstructionText,
      },
      contents: [...(history || []).map((h: any) => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content }] })), { role: 'user', parts: [{ text: query }] }],
    });
    
    console.log(`[NLAMS AI] Gemini Response Generated Successfully`);
    
    res.json({
      answer: response.text,
      sources: sources
    });
  } catch (error: any) {
    require('fs').appendFileSync('error.log', error.message + '\n' + String(error.stack) + '\n'); console.error('[NLAMS AI ERROR] stage: Gemini API, message:', error.message || String(error));
    // Provide a precise error message based on the failure
    let details = 'The AI service is temporarily unavailable. Please try again.';
    if (error.message && error.message.includes('quota')) {
       details = 'The AI service quota is exhausted. Please try again later.';
    }
    res.status(500).json({ error: 'Failed to process AI chat request', details: details });
  }
});

export default router;
