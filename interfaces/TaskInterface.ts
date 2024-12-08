

export interface Task {
    id: string,
    name: string;
    status: string;
    responsable : any[],
    houseId: string,
    type : string,
    frequency : string[],
    description : string,
    lastExecutionUserId : string,
    createdBy: string,
    nextExecutionUserId : string,
    executionDate : string
  }