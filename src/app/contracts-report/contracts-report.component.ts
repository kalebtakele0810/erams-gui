import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContractsReportService} from "../services/contracts-report.service";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DatePickerDialogComponent} from "../date-picker-dialog/date-picker-dialog.component";
import {ContractReportModel} from "../../models/ContractReportModel";
import {Subject} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";


@Component({
  selector: 'app-contracts-report',
  templateUrl: './contracts-report.component.html',
  styleUrls: ['./contracts-report.component.css']
})
export class ContractsReportComponent implements OnInit, OnDestroy {

  type: string = ""
  contracts: ContractReportModel[] = []
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  numberOfRecords: number = 0
  fiscalYear: string = ""

  constructor(
    private contractsReportService: ContractsReportService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      dom: 'Bfrtip',
      buttons: [
        'copy',
        {
          extend: 'print',
          customize: function (win: any) {
            $(win.document.body)
              .css('font-size', '2pt');
          }
        },
        {
          extend: 'excelHtml5',
          messageTop: ``,
          title: 'Ethiopian Road Authority',
          customize: function (xlsx: any) {
            let sheet = xlsx.xl.worksheets['sheet1.xml']
            //Word wrap
            $('row c', sheet).attr('s', '55')
            $('c[r=A1]', sheet).attr('s', '2');
            $('c[r=A1]', sheet).attr('s', '51');
            //Column Width
            let col = $('col', sheet)
            $(col[1]).attr('width', 40)

            $(col[4]).attr('width', 20)
            $(col[5]).attr('width', 20)

            //Row Manipulation
            let row = $('row', sheet)
            $(row[0]).attr('s', '2')
            let style = xlsx.xl['styles.xml']
            let sizes = style.getElementsByTagName('sz')
            for (let i = 0; i < sizes.length; i++) {
              sizes[i].setAttribute("val", "7")
            }
            let fonts = style.getElementsByTagName('name')
            for (let i = 0; i < fonts.length; i++) {
              fonts[i].setAttribute("val", "Arial")
            }
          }
        },
        'csv'
      ]
    };

    this.activatedRoute.queryParams.subscribe(query => {
      this.type = query["type"]
      if (this.type == "minimum")
        this.open()
      else if (this.type == "last")
        this.getReport("last", "")
      else if (this.type == "current")
        this.getReport("current", "")
    })
  }

  open() {
    const dialogRef = this.dialog.open(DatePickerDialogComponent,
      {width: '350px'})
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.getReport(this.type, result)
    })
  }

  getReport(type: string, startDate: string) {
    this.spinner.show("loading")
    let date = new Date()
    let start = startDate
    let end = date.toLocaleString()
    if (type == "last") {
      start = `09-11-${date.getFullYear() - 2}`
      end = `07-07-${date.getFullYear() - 1}`
      this.fiscalYear = `${date.getFullYear() - 9}`

    }
    if (type == "current") {
      start = `09-11-${date.getFullYear() - 1}`
      end = `07-07-${date.getFullYear()}`
      this.fiscalYear = `${date.getFullYear() - 8}`
    }
    this.contractsReportService.getReport(start, end).subscribe({
      next: (response) => {
        this.spinner.hide("loading")

        console.log(response)
        this.contracts = response
        this.dtTrigger.next('')
        response.forEach(value => {
          let annualBudget = (value.cumulativeSpentAgainstAnnualBudget != undefined) ? value.cumulativeSpentAgainstAnnualBudget : 0
          this.numberOfRecords = response.length - 1

        })
      },
      error: (err) => {
        this.spinner.hide("loading")
        console.log(err)
      }
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }
}
