import { Injectable } from '@angular/core';
import { TreeviewItem } from '../../../shared/dropdown/treeview-dropdown-lib';
// import { TreeviewItem } from '../../../shared/treeview-dropdown-lib';

export class DropdownService {
    getData(): TreeviewItem[] {
        const itCategory = new TreeviewItem({
            text: 'IT', value: 9, children: [
                {
                    text: 'Programming', value: 91, children: [{
                        text: 'Frontend', value: 911, children: [
                            { text: 'Angular 1', value: 9111 },
                            { text: 'Angular 2', value: 9112 },
                            { text: 'ReactJS', value: 9113 }
                        ]
                    }, {
                        text: 'Backend', value: 912, children: [
                            { text: 'C#', value: 9121 },
                            { text: 'Java', value: 9122 },
                            { text: 'Python', value: 9123, }
                        ]
                    }]
                },
                {
                    text: 'Networking', value: 92, children: [
                        { text: 'Internet', value: 921 },
                        { text: 'Security', value: 922 }
                    ]
                }
            ]
        });
        const continents = new TreeviewItem({
            text: 'Asia', value: 7, children: [
                {
                    text: 'India', value: 71, children: [{
                        text: 'Uttar Pradesh', value: 711, children: [
                            { text: 'Lucknow', value: 7111, children:[
                                {text:"Rajajipuram", value:71112, children:[
                                    {text:"E-Block", value:711121, checked:true},
                                    {text:"A-Block", value:711122}
                                ]},
                                { text: 'Hazrajganj', value: 71113,children:[
                                    {text:"Halwasiya Court", value:711131, children:[
                                        {text:"Techelogy Solution", value:7111311}
                                    ]},
                                    {text:"YMCA Crossing", value:711132, checked:true}] 
                                }
                                
                                
                            ] },
                            { text: 'Kanpur', value: 7112 },
                            { text: 'Allahabad', value: 7113}
                        ]
                    }, {
                        text: 'Madhiya Pradesh', value: 712, children: [
                            { text: 'Bhopal', value: 7121 },
                            { text: 'Jabalpur', value: 7122 }
                        ]
                    }]
                }
            ]
        });
        return [continents, itCategory];
    }
}
