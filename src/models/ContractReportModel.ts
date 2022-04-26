export interface ContractReportModel {
  contractName: string,
  contractNumber: string,
  budget: number,
  budgetYear: string,
  cumulativeSpentAgainstAnnualBudget?: number
  cumulativeSpentAgainstAnnualBudgetPercent?: number,
  lastMeasurementDate?: string,
  directorate?: string,
  teamLeaderName: string,
  teamLeaderTelephone: string,
  contractCompletionDate: string
}
