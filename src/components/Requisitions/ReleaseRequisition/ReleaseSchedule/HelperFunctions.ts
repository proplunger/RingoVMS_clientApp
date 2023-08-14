import * as React from "react";
import axios from "axios";
import { VendorDropdownModel } from "./IReleaseVendorState";
import _ from "lodash";

let vendorMasterDropdownList: VendorDropdownModel[] = [
    {
        label: "All Platinum",
        id: "All Platinum",
        className: "lplatinum-bg",
        tagClassName: "lplatinum-bg",
        children: [],
        rankingType: "Platinum",
    },
    {
        label: "All Gold",
        id: "All Gold",
        className: "lgold-bg",
        tagClassName: "lgold-bg",
        children: [],
        rankingType: "Gold",
    },
    {
        label: "All Silver",
        id: "All Silver",
        className: "lsilver-bg",
        tagClassName: "lsilver-bg",
        children: [],
        rankingType: "Silver",
    },
    {
        label: "All Utility",
        id: "All Utility",
        className: "lutility-bg",
        tagClassName: "lutility-bg",
        children: [],
        rankingType: "Utility",
    },
];

export async function GetClientLocationVendors(clientId: string, locationId: string, divisionId:string): Promise<any> {
    var res;
    res = await axios.get(`api/clients/vendors?clientId=${clientId}&locationId=${locationId}&divisionId=${divisionId}`);
    if (res.data.length > 0) {
        res.data = _.uniqBy(res.data,'id');
        return CreateVendorDropdownMenu(res.data);
    } else {
        return [];
    }
}
// export async function GetClientLocationVendors(clientId: string, locationId: string): Promise<any> {
//     var res;
//     return [];
// }

function CreateVendorDropdownMenu(vendorsList: any[]) {
    var vendorArray: Array<VendorDropdownModel> = JSON.parse(JSON.stringify(vendorMasterDropdownList));
    vendorsList.forEach((element) => {
        var vendorRankingIndex = vendorArray.findIndex((v) => v.rankingType==element.ranking);
        if (vendorRankingIndex !=-1) {
            vendorArray[vendorRankingIndex].children.push({
                rankingType: element.ranking,
                id: element.id,
                label: element.name,
                tagClassName: "l" + element.ranking.toLowerCase() + "-bg",
            });
        }
    });

    return vendorArray;
}

export function GetVendorVMList(selectedReleaseVendorMapping: any[], selectedVendors: any[]): any[] {
    var vendorsVMList: any[] = [];
    selectedVendors.forEach((element) => {
        if (element._parent) {
            vendorsVMList.push({
                vendorId: element.id,
                rank:
                    selectedReleaseVendorMapping.find((x) => x.vendorId==element.id) !=undefined
                        ? selectedReleaseVendorMapping.find((x) => x.vendorId==element.id).tier
                        : element.rankingType,
                releaseVendorMappingId:
                    selectedReleaseVendorMapping.find((x) => x.vendorId==element.id) !=undefined
                        ? selectedReleaseVendorMapping.find((x) => x.vendorId==element.id).reqReleaseVendorMapId
                        : undefined,
            });
        } else {
            if (element._children) {
                element._children.forEach((childElem) => {
                    if (vendorsVMList.findIndex((c) => c==childElem)==-1) {
                        vendorsVMList.push({
                            vendorId: childElem,
                            rank:
                                selectedReleaseVendorMapping.find((x) => x.vendorId==childElem) !=undefined
                                    ? selectedReleaseVendorMapping.find((x) => x.vendorId==childElem).tier
                                    : element.rankingType,
                            releaseVendorMappingId:
                                selectedReleaseVendorMapping.find((x) => x.vendorId==childElem) !=undefined
                                    ? selectedReleaseVendorMapping.find((x) => x.vendorId==childElem).reqReleaseVendorMapId
                                    : undefined,
                        });
                    }
                });
            }
        }
    });
    return vendorsVMList;
}

export function GetUnReleasedVendorList(selectedReleaseVendorMapping: any[], selectedVendors: any[]): any[] {
    var unreleasedVendorsVMList: any[] = [];
    selectedVendors.forEach((element) => {
        if (element.parent) {
            unreleasedVendorsVMList.push({
                releaseVendorMappingId:
                    selectedReleaseVendorMapping.find((x) => x.vendorId==element.id) !=undefined
                        ? selectedReleaseVendorMapping.find((x) => x.vendorId==element.id).releaseVendorMappingId
                        : undefined,
            });
        } else {
            if (element.children) {
                element.children.forEach((childElem) => {
                    if (unreleasedVendorsVMList.findIndex((c) => c==childElem)==-1) {
                        unreleasedVendorsVMList.push({
                            releaseVendorMappingId:
                                selectedReleaseVendorMapping.find((x) => x.vendorId==childElem.id) !=undefined
                                    ? selectedReleaseVendorMapping.find((x) => x.vendorId==childElem.id).releaseVendorMappingId
                                    : undefined,
                        });
                    }
                });
            }
        }
    });
    return unreleasedVendorsVMList;
}
export function SelectDropdownMenus(vendors: VendorDropdownModel[], selection: any[]): VendorDropdownModel[] {
    var finalVendors = JSON.parse(JSON.stringify(vendors));
    selection.forEach((element) => {
        finalVendors.forEach((vendor) => {
            if (element.hasOwnProperty("name")) {
                var x = selection.map((x) => x.id);
                var isAllPresent = vendor.children.every((child) => x.indexOf(child.id) !=-1);
                if (isAllPresent) {
                    vendor.checked = true;
                    vendor.children.forEach((child) => {
                        child.checked = true;
                    });
                }
            } else if (vendor.label==element.label && element.checked) {
                vendor.checked = true;
                vendor.children.forEach((child) => {
                    child.checked = true;
                });
            }
            vendor.children.forEach((child) => {
                if (child.id==element.id) {
                    child.checked = true;
                }
            });
        });
    });

    return finalVendors;
}

export function FindSelectedVendorValues(vendors: VendorDropdownModel[], selection: any[], isReleased?): any[] {
    var selectedVendors = JSON.parse(JSON.stringify(selection)).map((x) => {
        return {
            vId: x.vendorId,
            tier:x.tier 
        }
    });
    var allVendors = JSON.parse(JSON.stringify(vendors));
    // selectedVendors.forEach(element => {
    //     allVendors.forEach(vendor => {
    //         vendor.children.forEach(child => {
    //             if (child.id==element.id) {
    //                 element.label = child.label;
    //                 element._id = child.id;
    //                 element.tagClassName = child.tagClassName;
    //             }
    //         });
    //     });
    // });

    var newSelectedVendors = [];

    allVendors.forEach((vendor) => {
        if (vendor.children.length > 0) {
            //var isAllPresent = vendor.children.every((child) => selectedVendors.map(x => x.vId).indexOf(child.id) !=-1);
            var isAllPresent = vendor.children.every((child) => _.findIndex(selectedVendors.map(x => {return {vId : x.vId,tier :x.tier}}),(y:any) => {return  y.vId==child.id && y.tier==child.rankingType}) !=-1);
            if (isAllPresent) {
                const a = {
                    id: vendor.id,
                    _id: vendor.id,
                    label: vendor.label,
                    tagClassName: vendor.tagClassName,
                    checked: true,
                    children: vendor.children.map((x) => x.id),
                    _children: vendor.children.map((x) => x.id),
                };
                newSelectedVendors.push(a);
            }
        }
    });

    selectedVendors.forEach((element) => {
        allVendors.forEach((vendor) => {
            if (!newSelectedVendors.some((x) => x.id==vendor.id)) {
                // parent present already
                vendor.children.forEach((child) => {
                    if (child.id==element.vId) {
                        const a = {
                            id: child.id,
                            _id: child.id,
                            label: child.label,
                            tagClassName: isReleased ? "l" + element.tier.toLowerCase() + "-bg" : child.tagClassName,
                            checked: true,
                            _parent: vendor.id,
                        };
                        newSelectedVendors.push(a);
                    }
                });
            }
        });
    });

    return newSelectedVendors;
}

export async function GetTimingCatalog() {
    var res;
    res = await axios.get(`api/requisitions/distcatalogs`);
    if (res.data.length > 0) {
        return res.data;
    } else {
        return [];
    }
}

export async function GetReleaseStatus() {
    var res;
    res = await axios.get(`api/requisitions/releasestatus`);
    if (res.data.length > 0) {
        return res.data;
    } else {
        return [];
    }
}

export function addBusinessDays(startDate, days) {
    if (isNaN(days)) {
        console.log('Value provided for "days" was not a number');
        return;
    }
    if (!(startDate instanceof Date)) {
        console.log('Value provided for "startDate" was not a Date object');
        return;
    }
    // Get the day of the week as a number (0 = Sunday, 1 = Monday, .... 6 = Saturday)
    var dow = startDate.getDay();
    var daysToAdd = parseInt(days);
    // If the current day is Sunday add one day
    if (dow==0) daysToAdd++;
    // If the start date plus the additional days falls on or after the closest Saturday calculate weekends
    if (dow + daysToAdd >= 6) {
        //Subtract days in current working week from work days
        var remainingWorkDays = daysToAdd - (5 - dow);
        //Add current working week's weekend
        daysToAdd += 2;
        if (remainingWorkDays > 5) {
            //Add two days for each working week by calculating how many weeks are included
            daysToAdd += 2 * Math.floor(remainingWorkDays / 5);
            //Exclude final weekend if remainingWorkDays resolves to an exact number of weeks
            if (remainingWorkDays % 5==0) daysToAdd -= 2;
        }
    }
    startDate.setDate(startDate.getDate() + daysToAdd);
    return startDate;
}
