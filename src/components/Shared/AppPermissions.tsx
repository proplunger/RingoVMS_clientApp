export enum Controllers {
    REQUISITION = "Requisition",
    CANDIDATE = "Candidate",
    ADMIN = "Admin",
    TS="TS"
  }
  
  export enum CandidateControllerActions {
    CREATECANDIDATEWFS = "PostCandidateWF",
    CREATECANDIDATE = "PostCandidate",
    UPDATECANDIDATE = "PutCandidateWF",
    DELETECANDIDATE = "DeleteCandidateWF",
    PatchCandidateWFStatus = "PatchCandidateWF",
    NAMECLEARCANDIDATE = "GetNameClearCandidate",
    POSTBATCHSUBMISSIONCANDIDATE = "PostBatchSubmissionCandidate",
    POSTBATCHINTERVIEWCANDIDATE = "PostBatchInterviewCandidate",
    POSTNAMECLEARCANDIDATE = "NameClearCandidate",
    READBILLRATE = "GetBillRates",
    POSTBILLRATE = "PostBillRate",
    PUTBILLRATE = "PutBillRate",
    DELETEBILLRATE = "DeleteBillRate",
    POSTCANDSUBINTERVIEW = "PostCandSubInterview",
    POSTCANDSUBINTERVIEWRESULT = "PostCandSubInterviewResult",
    PUTSUBMITONBOARDINGTASK = "PutCandSubOnboardingTask",
    UPDATECANDSUBONBOARDINGTASK = "PutCandSubOnboardingTask",
    GETEXPENSES = "GetExpenses"
  }

  
export enum AdminControllerActions {
    GETCANDSUBUSERCALS = "GetCandSubUserCals",
    CREATECANDSUBUSERCAL = "PostCandSubUserCal",
  }