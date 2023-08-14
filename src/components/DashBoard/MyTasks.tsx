import * as React from "react";
import { getIcon } from "../Shared/Workflow/icon";
import DashBoardDataService from "./Service/DataService";
import ItemsCarousel from "react-items-carousel";
import { leftChivron, rightChivron, ShimmerEffectTab } from "../ReusableComponents";

import { history } from "../../HelperMethods";
import { MANAGE_MY_TASKS } from "../Shared/ApiUrls";
export interface TasksProps { }

export interface TasksState {
    data?: any;
    activeItemIndex?: any;
    windowWidth?: any;
    noOfCards?: any;
    openTaskDetailBox: any;
    taskTypeId?: any;
    firstLoad?: boolean;
    setInterval?: any;
}

class Tasks extends React.Component<TasksProps, TasksState> {
    activeItem;

    constructor(props: TasksProps) {
        super(props);
        this.state = {
            data: [],
            activeItemIndex: 0,
            windowWidth: window.innerWidth,
            noOfCards: 4,
            openTaskDetailBox: false,
            setInterval: 10000,
            firstLoad: true,
        };
    }

    componentDidMount() {
        this.getTasks();
        this.handleResize();
        // this.activeItem = setInterval(() => {
        //     const { data, noOfCards } = this.state;
        //     return this.changeActiveItem(data.length, noOfCards);
        // }, this.state.setInterval);
        window.addEventListener("resize", this.handleResize);
    }
    componentWillUnmount() {
        clearInterval(this.activeItem);
        window.addEventListener("resize", this.handleResize);
    }

    handleResize = () => {
        this.setState({ windowWidth: window.innerWidth }, () =>
            this.state.windowWidth < 500
                ? this.setState({ noOfCards: 2 })
                : this.state.windowWidth > 500 && this.state.windowWidth < 992
                    ? this.setState({ noOfCards: 3 })
                    : this.setState({ noOfCards: 4 })
        );
    };
    getTasks = () => {
        DashBoardDataService.getTasks().then((res) => {
            this.setState({ data: res.data, firstLoad: false });
        });
    };

    changeActiveItem = (noOfItems, noOfCards) => {
        this.setState((prevState) => ({
            activeItemIndex:
                (prevState.activeItemIndex + 1) % (noOfItems - noOfCards + 1),
        }));
    };


    render() {
        const { data, activeItemIndex, noOfCards, firstLoad } = this.state;
        return (
            <div className="parent p-0">
                {!firstLoad && data.length==0 ? <div className="border-bottom mx-0" style={{ height: "100px", paddingTop: "40px" }}><p className="font-weight-bold">No Pending Tasks!</p></div> :
                    <ItemsCarousel
                        placeholderItem={
                            ShimmerEffectTab()
                        }
                        infiniteLoop={noOfCards < data.length ? true : false}
                        enablePlaceholder={true}
                        numberOfPlaceholderItems={6}
                        minimumPlaceholderTime={1000}
                        numberOfCards={noOfCards}
                        // gutter={15}
                        showSlither={true}
                        firstAndLastGutter={true}
                        freeScrolling={false}
                        requestToChangeActive={(e) => this.setState({ activeItemIndex: e, setInterval: 10000 })}
                        activeItemIndex={activeItemIndex}
                        activePosition={"left"}
                        chevronWidth={20}
                        rightChevron={rightChivron()}
                        leftChevron={leftChivron()}
                        outsideChevron={false}
                    >
                        {data &&
                            data.map((i) => {
                                return (
                                    <div className="row ml-mr mx-0" onClick={() => history.push(`${MANAGE_MY_TASKS}/${i.taskTypeId}/${i.taskGroup}`)} style={{ cursor: "pointer" }}>
                                        <div className="col-12 px-1">
                                            <div
                                                className="card h-100 pt-2 pl-0 pr-0 pb-2 shadow-sm my-task-bg-color"
                                                title={i.description}
                                            >
                                                <div className="card-body p-1 pt-0 pb-2">
                                                    <div className="row mx-0 mt-3 mb-3">
                                                        <div className="card-title col-6 col-sm-7 text-dark text-left pl-2 pr-0 mb-0 d-flex align-items-center">
                                                            <h3 className="mb-0  h3_font-size" title={i.value}>
                                                                {i.value}
                                                            </h3>
                                                        </div>
                                                        <div className="col-6 col-sm-5 pr-2 pl-0 slider-icon">
                                                            <img className="img-thumbnail border-0 background-color" src={require(`../../assets/icons/MY_TASK/${i.icon}`)} />
                                                            {/* {i &&  getIcon(i.icon)} */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body mt-2 p-1">
                                                    <div className="row mx-0 text-left mt-2">
                                                        <div
                                                            className="font-size_item pr-0 pl-2"
                                                            title={i.name}
                                                            style={{
                                                                textOverflow: "ellipsis",
                                                                overflow: "hidden",
                                                                whiteSpace: "nowrap",
                                                            }}
                                                        >
                                                            {i.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </ItemsCarousel>}
            </div>
        );
    }
}

export default Tasks;
