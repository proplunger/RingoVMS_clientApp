import * as React from "react";
import { getIcon } from "../Shared/Workflow/icon";
import DashBoardDataService from "./Service/DataService";
import ItemsCarousel from "react-items-carousel";

import { leftChivron, NorecordFoundCard, rightChivron, ShimmerEffectTab } from "../ReusableComponents";
export interface KPIProps { }

export interface KPIState {
    showLoader?: boolean;
    data?: any;
    activeItemIndex?: any;
    windowWidth?: any;
    noOfCards?: any;
    setInterval: any;
    firstLoad?: boolean;

}

class KPI extends React.Component<KPIProps, KPIState> {
    activeItem;
    constructor(props: KPIProps) {
        super(props);
        this.state = {
            showLoader: true,
            data: [],
            activeItemIndex: 0,
            noOfCards: 6,
            windowWidth: window.innerWidth,
            setInterval: 10000,
            firstLoad: true,
        };
    }

    componentDidMount() {
        this.getKpis();
        this.handleResize();
        // this.activeItem = setInterval(
        //     () => {
        //         const { data, noOfCards } = this.state;
        //         return this.changeActiveItem(
        //             data.length, noOfCards
        //         )
        //     },
        //     this.state.setInterval
        // );
        window.addEventListener("resize", this.handleResize);
    }
    componentWillUnmount() {
        clearInterval(this.activeItem);
        window.addEventListener("resize", this.handleResize);
    }

    getKpis = () => {
        DashBoardDataService.getKPIs().then((res) => {
            this.setState({ data: res.data, showLoader: false, firstLoad: false });
        });
    };

    // Change Active Item (Autoplay)
    changeActiveItem = (noOfItems, noOfCards) => {
        this.setState(prevState => ({
            activeItemIndex: (prevState.activeItemIndex + 1) % (noOfItems - noOfCards + 1),
        }));
    };

    //  Window Resize (responsivenes)
    handleResize = () => {
        this.setState({ windowWidth: window.innerWidth }, () =>
            this.state.windowWidth < 500
                ? this.setState({ noOfCards: 2 })
                : this.state.windowWidth > 500 && this.state.windowWidth < 992 ?
                    this.setState({ noOfCards: 4 }) : this.setState({ noOfCards: 6 })
        );
    };


    renderCards = (i?) => {
        return <div className="row ml-mr mx-0 formsmallscrenn-Dashboard">
            <div className="col-12 px-1">
                <div
                    className="card h-100 pt-2 pl-0 pr-0 pb-2 shadow-sm"
                    title={i && i.description}>
                    <div className="card-body p-1 pt-0 pb-0">
                        <div className="row mx-0 mt-3 mb-3 formsmallscreen_dash">
                            <div className="card-title col-12 col-xl-7 text-dark text-left pl-2 pr-0 mb-0 d-flex align-items-center">
                                <h3 className="mb-0  h3_font-size slider-elliipse" title={i && i.value}>
                                    {i && i.value}
                                </h3>
                            </div>
                            <div className="col-12 col-xl-5 pr-2 pl-0 slider-icon d-none d-xl-block">
                                {i && <img className="img-thumbnail border-0" src={require(`../../assets/icons/KPI/${i.icon}`)} />}
                                {/* {i && getIcon(i.icon)} */}
                            </div>
                        </div>
                    </div>

                    <div className="card-body mt-2 p-1 formsmallscreen_dash">
                        <div className="row mx-0 text-left mt-2">
                        <div className="col-6 col-sm-6 col-lg-5 pr-2 pl-0 slider-icon d-block d-xl-none">
                                {i && <img className="img-thumbnail border-0" src={require(`../../assets/icons/KPI/${i.icon}`)} />}
                                {/* {i && getIcon(i.icon)} */}
                            </div>
                            <div
                                className="col-12 font-size_item pr-0 pl-0 pl-xl-2 slider-elliipse"
                                title={i && i.name}>
                                {i && i.name}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {/* <div className="col-12 px-1">
                <div
                    className="card h-100 pt-2 pl-0 pr-0 pb-2 shadow-sm"
                    title={i && i.description}>
                    <div className="card-body p-1 pt-0 pb-0">
                        <div className="row mx-0 mt-3 mb-3">
                            <div className="card-title col-7 col-sm-7 text-dark text-left pl-2 pr-0 mb-0 d-flex align-items-center">
                                <h3 className="mb-0  h3_font-size slider-elliipse">
                                    3
                                </h3>
                            </div>
                            <div className="col-5 col-sm-5 pr-2 pl-0 slider-icon">
                                {i && <img className="img-thumbnail border-0" src={require(`../../assets/icons/KPI/${i.icon}`)} />}
                                
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-body mt-2 p-1">
                        <div className="row mx-0 text-left mt-2">
                            <div
                                className="font-size_item pr-0 pl-2 slider-elliipse">
                                Pending Approval
                            </div>
                        </div>
                    </div>
                </div>

            </div> */}
        </div>
    }

    render() {
        const { data, activeItemIndex, noOfCards, firstLoad } = this.state;

        return (<div className="parent p-0">
            {!firstLoad && data.length==0 ? <div className="border-bottom mx-0 " style={{ height: "100px", paddingTop: "40px" }}>No KPI to display!</div> :
                <ItemsCarousel
                    placeholderItem={
                        ShimmerEffectTab()
                    }
                    infiniteLoop={noOfCards < data.length ? true : false}
                    enablePlaceholder={true}
                    numberOfPlaceholderItems={6}
                    numberOfCards={noOfCards}
                    // gutter={20}
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
                                this.renderCards(i)
                            );
                        })}

                </ItemsCarousel>}
        </div>

        );
    }
}

export default KPI;
