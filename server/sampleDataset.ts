export const NLAMS_DATASET_INFO = "NLAMS Demo Sample Dataset - For Testing Only";

export const projects = [
  { projectId: "NLAMS-PRJ-001", projectName: "Chennai-Salem Expressway", projectType: "Highways", department: "NHAI", state: "Tamil Nadu", district: "Salem", status: "Possession Handover", totalAffectedParcels: 400, verifiedParcels: 350, pendingVerification: 50, totalLandArea: 450, totalLandowners: 380 },
  { projectId: "NLAMS-PRJ-002", projectName: "Pune Metro Line 3", projectType: "Urban Transport", department: "PMRDA", state: "Maharashtra", district: "Pune", status: "Compensation", totalAffectedParcels: 120, verifiedParcels: 120, pendingVerification: 0, totalLandArea: 15.5, totalLandowners: 110 },
  { projectId: "NLAMS-PRJ-003", projectName: "Kochi Water Metro Expansion", projectType: "Waterways", department: "KMRL", state: "Kerala", district: "Ernakulam", status: "Notification", totalAffectedParcels: 85, verifiedParcels: 40, pendingVerification: 45, totalLandArea: 12, totalLandowners: 75 },
  { projectId: "NLAMS-PRJ-004", projectName: "Jewar Airport Phase 2", projectType: "Aviation", department: "YIAPL", state: "Uttar Pradesh", district: "Gautam Buddha Nagar", status: "Awards", totalAffectedParcels: 1200, verifiedParcels: 1000, pendingVerification: 200, totalLandArea: 1365, totalLandowners: 1050 },
  { projectId: "NLAMS-PRJ-005", projectName: "Mumbai-Ahmedabad Bullet Train", projectType: "Railways", department: "NHSRCL", state: "Gujarat", district: "Surat", status: "Rehabilitation", totalAffectedParcels: 560, verifiedParcels: 560, pendingVerification: 0, totalLandArea: 280, totalLandowners: 490 }
];

export const landParcels = Array.from({length: 20}, (_, i) => ({
  parcelId: `LP-${(i+1).toString().padStart(3, '0')}`,
  projectId: `NLAMS-PRJ-00${(i%5)+1}`,
  surveyNumber: `SN-${100+i}/${i%3+1}A`,
  district: ["Salem", "Pune", "Ernakulam", "Gautam Buddha Nagar", "Surat"][i%5],
  village: ["Omalur", "Hinjewadi", "Vyttila", "Jewar", "Palsana"][i%5],
  landArea: Number((Math.random() * 5 + 0.5).toFixed(2)),
  landType: i % 4 === 0 ? "Commercial" : "Agricultural",
  ownerName: ["Ravi Kumar", "Priya Desai", "Thomas Kurian", "Amit Singh", "Bhavik Shah", "Lakshmi S.", "Rahul Patil", "Mary Joseph", "Vikram Chaudhary", "Narendra Patel", "Karthik V.", "Sanjay Joshi", "Murugan Traders", "Surat Textiles Ltd", "Rajesh Kumar", "Anitha R.", "Mohan L.", "Deepak C.", "Pooja M.", "Vijay K."][i]
}));

export const verification = landParcels.map((p, i) => ({
  parcelId: p.parcelId,
  verificationStatus: i === 2 || i === 7 || i === 11 ? "Pending" : "Verified",
  verifiedBy: i === 2 || i === 7 || i === 11 ? null : "Officer_A",
  verificationDate: i === 2 || i === 7 || i === 11 ? null : "2023-10-01",
  pendingReason: i === 2 || i === 7 || i === 11 ? "Title dispute" : null
}));

export const compensation = landParcels.map((p, i) => {
  const isPending = i % 3 === 0;
  const isNotAssessed = i === 2 || i === 7 || i === 11;
  const total = p.landArea * 1000000;
  
  return {
    parcelId: p.parcelId,
    ownerName: p.ownerName,
    compensationStatus: isNotAssessed ? "Not Assessed" : (isPending ? "Pending" : "Paid"),
    eligibleAmount: total,
    approvedAmount: total,
    paidAmount: isNotAssessed ? 0 : (isPending ? total * 0.5 : total),
    pendingAmount: isNotAssessed ? 0 : (isPending ? total * 0.5 : 0),
    paymentStatus: isNotAssessed ? "Not Initiated" : (isPending ? "Partially Paid" : "Completed"),
    paymentDate: !isNotAssessed && !isPending ? "2024-01-15" : null
  };
});

export const rehabilitation = landParcels.map((p, i) => ({
  parcelId: p.parcelId,
  affectedFamily: p.ownerName,
  eligibilityStatus: i % 2 === 0 ? "Eligible" : "Not Required",
  rehabilitationStatus: i % 2 === 0 ? (i % 4 === 0 ? "In Progress" : "Completed") : "Not Required",
  assistanceAmount: i % 2 === 0 ? 500000 : 0,
  completionDate: (i % 2 === 0 && i % 4 !== 0) ? "2024-02-20" : null
}));

export const possession = landParcels.map((p, i) => {
  const comp = compensation[i];
  return {
    parcelId: p.parcelId,
    possessionStatus: comp.paymentStatus === "Completed" ? "Completed" : "Pending",
    possessionDate: comp.paymentStatus === "Completed" ? "2024-03-01" : null,
    pendingReason: comp.paymentStatus !== "Completed" ? "Pending compensation payment" : null
  };
});
