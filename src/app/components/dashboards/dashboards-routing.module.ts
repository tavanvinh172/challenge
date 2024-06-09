import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { materialComponent } from '../../../utils/helpers/installation';
import { DashboardsComponent } from './dashboards.component';
// import { ChartModule } from 'angular-highcharts';
import { CommonModule } from '@angular/common';
const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: DashboardsComponent }
        ]
    },
];

@NgModule({
    declarations: [DashboardsComponent],
    imports: [RouterModule.forChild(routes), materialComponent, CommonModule],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
