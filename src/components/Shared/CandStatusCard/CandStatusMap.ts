export function CandStatusMap() {
    var candStatusMap = [
      {
        stepId:1,
        value:"Submitted candidate",
        initialState:{text:"Pending Submission", stateType:"Initial"},
        completedState:{text:"Submitted", stateType:"Completed"},
        date:"12/22/2020",
        opendays:"1"
      },
      {
        stepId:2,
        value:"Name Clear",
        initialState:{text:"Pending For Name Clear", stateType:"Initial"},
        inProgressState:{text:"Submitted For Name Clear", stateType:"In Progress"},
        deniedState:{text:"Name Not Cleared", stateType:"Denied"},
        cancelledState:{text:"Withdrawn", stateType:"Cancelled"},
        completedState:{text:"Name Cleared", stateType:"Completed"},
        date:"12/28/2020",
        opendays:"1"
       },
       {
        stepId:3,
        value:"Risk Attestation",
        initialState:{text:"Pending For Risk Attestation", stateType:"Initial"},
        inProgressState:{text:"Submitted For Risk Attestation", stateType:"In Progress"},
        deniedState:{text:"", stateType:"Denied"},
        cancelledState:{text:"Withdrawn", stateType:"Cancelled"},
        completedState:{text:"Risk Attested", stateType:"Completed"}
       },
       {
        stepId:4,
        value:"Risk Clear",
        initialState:{text:"Pending For Risk Clearance", stateType:"Initial"},
        inProgressState:{text:"Submitted For Risk Clearance", stateType:"In Progress"},
        deniedState:{text:"Risk Not Cleared", stateType:"Denied"},
        cancelledState:{text:"Withdrawn", stateType:"Cancelled"},
        completedState:{text:"Risk Cleared", stateType:"Completed"}
       },
       {
        stepId:5,
        value:"Vendor Presentation",
        initialState:{text:"Pending For Vendor Presentation", stateType:"Initial"},
        inProgressState:{text:"Vendor Presentation Submitted", stateType:"In Progress"},
        deniedState:{text:"Vendor Presentation Rejected", stateType:"Denied"},
        cancelledState:{text:"Withdrawn", stateType:"Cancelled"},
        completedState:{text:"Vendor Presentation Submitted", stateType:"Completed"}
       },
       {
        stepId:6,
        value:"Client Presentation",
        initialState:{text:"Pending For Client Presentation", stateType:"Initial"},
        inProgressState:{text:"", stateType:"In Progress"},
        deniedState:{text:"Client Presentation Rejected", stateType:"Denied"},
        cancelledState:{text:"Withdrawn", stateType:"Cancelled"},
        completedState:{text:"", stateType:"Completed"}
       },
       {
        stepId:7,
        value:"Interview",
        initialState:{text:"Pending Schedule Interview", stateType:"Initial"},
        inProgressState:{text:"", stateType:"In Progress"},
        deniedState:{text:"", stateType:"Denied"},
        cancelledState:{text:"Withdrawn", stateType:"Cancelled"},
        completedState:{text:"", stateType:"Completed"}
       },
       {
        stepId:8,
        value:"Offer",
        initialState:{text:"", stateType:"Initial"},
        inProgressState:{text:"", stateType:"In Progress"},
        deniedState:{text:"", stateType:"Denied"},
        cancelledState:{text:"Withdrawn", stateType:"Cancelled"},
        completedState:{text:"", stateType:"Completed"}
       },
       {
        stepId:9,
        value:"On Boarding",
        initialState:{text:"Pending Schedule Interview", stateType:"Initial"},
        inProgressState:{text:"", stateType:"In Progress"},
        deniedState:{text:"", stateType:"Denied"},
        cancelledState:{text:"Withdrawn", stateType:"Cancelled"},
        completedState:{text:"", stateType:"Completed"}
       },
       {
        stepId:10,
        value:"Fill Position",
        initialState:{text:"", stateType:"Initial"},
        inProgressState:{text:"", stateType:"In Progress"},
        deniedState:{text:"", stateType:"Denied"},
        cancelledState:{text:"Withdrawn", stateType:"Cancelled"},
        completedState:{text:"", stateType:"Completed"}
       }
    ];
    return candStatusMap;
  }