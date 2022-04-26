export interface Contract {
  contractId?: number,
  projectId?: number,
  designContractId?: number,
  workContractId?: number,
  contractNumber: string,
  contractName: string,
  contractType?: string,
  budget?: number,
  budgetYear?: number
}
