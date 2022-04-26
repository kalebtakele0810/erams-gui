import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ProjectService} from "../services/project.service";
import {ProjectModel} from "../../models/ProjectModel";
import {Router} from "@angular/router";
import {ProjectFunderModel} from "../../models/ProjectFunderModel";
import {ProjectCurrencyBreakDownModel} from "../../models/ProjectCurrencyBreakDownModel";
import {NgxSpinnerService} from "ngx-spinner";
import {NgToastService} from "ng-angular-popup";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectSearchModel} from "../../models/ProjectSearchModel";
import {FundSourceModel} from "../../models/FundSourceModel";
import FullProjectModel from "../../models/FullProjectModel";

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  project = new FormGroup({
    RSDP: new FormControl(''),
    Name: new FormControl(''),
    Number: new FormControl(''),
    Description: new FormControl(''),
    StartDate: new FormControl(''),
    Duration: new FormControl(),
    DueDate: new FormControl(''),
    TotalValue: new FormControl(),
    RoadLength: new FormControl(''),
  })
  currencyBreakDownFormGroup = new FormGroup({
    Amount: new FormControl(),
    ExchangeRate: new FormControl(1)
  })

  newFunderFormGroup = new FormGroup({
    FundSource: new FormControl()
  })

  rsdps: string[] = []
  fundSources: string[] = []
  fundTypes: string[] = []
  currencies: string[] = []
  rsdp: string = ""
  fundSource: string = ""
  fundType: string = ""
  currency: string = ""
  dueDate: string = ''

  projectId: number = 0
  currentIndex: number = -1

  projectFunders: ProjectFunderModel[] = []
  projectCurrencyBreakDowns: ProjectCurrencyBreakDownModel[] = []

  projectSearches: ProjectSearchModel[] = []
  projectSearchControl = new FormControl()

  filteredOptions: ProjectSearchModel[] = []
  opened: boolean = false

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toast: NgToastService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.getAllRSDPs()
    this.getAllFundSources()
    this.getAllFundTypes()
    this.getAllCurrencies()
    this.initForm()
    console.log(this.projectSearches)
    this.getAllProjects()
  }

  getAllProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (response) => {
        response.forEach(value => {
          this.projectSearches.push({
            projectId: value.projectId,
            number: value.number,
            name: value.name
          })
          this.filteredOptions.push({
            projectId: value.projectId,
            number: value.number,
            name: value.name
          })
        })
      }
    })
  }

  initForm() {
    this.projectSearchControl.valueChanges.subscribe({
      next: (response) => {
        console.log(response)
        this.filterData(response)
      }
    })
  }

  filterData(filteredData: string) {
    console.log(filteredData)
    this.filteredOptions = this.projectSearches.filter(value => {
      return value.name.toLowerCase().indexOf(filteredData.toLowerCase()) > -1
    })
  }

  displayFn(projectSearchModel: ProjectSearchModel): string {
    return projectSearchModel && projectSearchModel.name ? projectSearchModel.name : '';
  }


  getAllRSDPs() {
    //Retrieving All RSDPs
    this.projectService.getAllRSDPs().subscribe({
      next: (response) => {
        this.rsdps = response
        console.log(this.rsdps)
      },
      error: (err) => {
        console.log(err.error)
      }
    })
  }

  getAllFundSources() {
    //Retrieving All Fund Sources
    this.projectService.getAllFundSources().subscribe({
      next: (response) => {
        this.fundSources = response
        console.log(this.fundSources)
      },
      error: (err) => {
        console.log(err.error)
      }
    })
  }

  //Retrieving All Fund Types
  getAllFundTypes() {
    this.projectService.getAllFundTypes().subscribe({
      next: (response) => {
        this.fundTypes = response
        console.log(this.fundTypes)
      },
      error: (err) => {
        console.log(err.error)
      }
    })
  }

  getAllCurrencies() {
    //Retrieving All Currencies
    this.projectService.getAllCurrencies().subscribe({
      next: (response) => {
        this.currencies = response
        console.log(this.currencies)
      },
      error: (err) => {
        console.log(err.error)
      }
    })
  }

  updateProject() {
    this.spinner.show()
    const modifiedProject: FullProjectModel = {
      projectId: this.projectId,
      rsdp: this.rsdp,
      name: this.project.value.Name,
      number: this.project.value.Number,
      description: this.project.value.Description,
      startDate: this.project.value.StartDate,
      duration: this.project.value.Duration,
      dueDate: this.dueDate,
      roadLength: this.project.value.RoadLength,
    }

    this.projectService.updateProject(modifiedProject).subscribe({
      next: () => {
        // this.spinner.hide()
        this.updateProjectFunder()
        this.updateProjectCurrencies()
      },
      error: (err) => {
        this.spinner.hide()
        this.toast.error({detail: "Error Occurred", summary: err.errors, duration: 2000, sticky: true})
      }
    })
  }

  updateProjectFunder() {
    console.log("Update funder called")
    console.log(this.projectFunders)
    this.projectService.updateProjectFunder(this.projectFunders).subscribe({
      next: () => {
        this.spinner.hide()
        console.log("update funder succeed")
        // this.toast.success({detail: "Success", summary: "Successfully Updated", duration: 2000, sticky: true})
      },
      error: (error) => {
        this.spinner.hide()
        this.toast.error({detail: "Error Occurred", summary: error.error(), duration: 2000, sticky: false})
        console.log(error)
      }
    })
  }

  updateProjectCurrencies() {
    console.log("Update Currencies called")
    console.log(this.projectCurrencyBreakDowns)
    this.projectService.updateProjectCurrencies(this.projectCurrencyBreakDowns).subscribe({
      next: () => {
        this.spinner.hide()
        console.log("update currencies succeed")
        this.toast.success({detail: "Success", summary: "Successfully Updated", duration: 2000, sticky: true})
      },
      error: (error) => {
        this.spinner.hide()
        this.toast.error({detail: "Error Occurred", summary: error.error, duration: 2000, sticky: true})
        console.log(error)

      }
    })
  }

  updateDueDate() {
    if (this.project.value.StartDate == '' || this.project.value.Duration == null)
      return
    let startDate = new Date(this.project.value.StartDate)
    let date = new Date(startDate.getFullYear() + this.project.value.Duration, startDate.getMonth(), startDate.getDate())
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    this.dueDate = `${date.getFullYear()}-${month}-${day}`
    this.project.patchValue({
      DueDate: `${startDate.toLocaleDateString()} - ${this.dueDate}`
    })
  }

  updateTotalValue() {
    if (this.projectCurrencyBreakDowns == [])
      return
    let totalValue = 0
    this.projectCurrencyBreakDowns.forEach(value => totalValue += value.amount)
    this.project.patchValue({
      TotalValue: totalValue
    })
  }

  addFundSourceLookup(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {

      if (this.newFunderFormGroup.value.FundSource.length < 3)
        return

      this.spinner.show()
      let fundSourceModel: FundSourceModel = {
        Source: this.newFunderFormGroup.value.FundSource
      }
      this.projectService.addFundSourceLookup(fundSourceModel).subscribe({
        next: () => {
          this.spinner.hide()
          this.toast.success({detail: "Success", summary: "Successfully Added", duration: 2000, sticky: true})
          this.getAllFundSources()
          this.fundSource = fundSourceModel.Source
        },
        error: (err) => {
          this.spinner.hide()
          this.toast.error({detail: "Error Occurred", summary: err.message, duration: 2000, sticky: true})
          console.log(err.message)
        }
      })
      console.log(this.newFunderFormGroup.value.FundSource)
    });
  }

  searchProject() {
    this.opened = !this.opened
    console.log(this.projectSearchControl.value)
    if (this.projectSearchControl.value.projectId != null) {
      this.projectId = this.projectSearchControl.value.projectId
      this.spinner.show()
      console.log(this.projectSearchControl.value)
      this.projectService.getProjectById(this.projectId).subscribe({
        next: (response) => {
          this.spinner.hide()
          this.project.patchValue({
            Number: response.number,
            Name: response.name,
            Description: response.description,
            RSDP: response.rsdp,
            StartDate: response.startDate,
            Duration: response.duration,
            DueDate: response.dueDate,
            RoadLength: response.roadLength
          })
          this.rsdp = response.rsdp
          $('#rsdp').val(this.rsdp)
          let date = new Date(response.startDate)
          let day = ("0" + date.getDate()).slice(-2);
          let month = ("0" + (date.getMonth() + 1)).slice(-2);
          let fixedDate = `${date.getFullYear()}-${month}-${day}`
          $('#startDate').val(fixedDate)
          this.updateDueDate()
        },
        error: (err) => {
          this.spinner.hide()
          console.log(err.message)
        }
      })
      this.projectService.getProjectFundersById(this.projectId).subscribe({
        next: (response) => {
          this.projectFunders = []
          response.forEach(value => {
              this.projectFunders.push({
                projectFunderId: value.projectFunderId,
                projectId: value.projectId,
                fundSource: value.fundSource,
                fundType: value.fundType,
              })
            }
          )
          console.log(this.projectFunders)
        },
        error: err => {
          this.toast.error({detail: "Error Occurred", summary: "Failed To Load Associated Project Funders"})
        }
      })
      this.projectService.getProjectCurrenciesById(this.projectId).subscribe({
        next: (response) => {
          this.projectCurrencyBreakDowns = []
          response.forEach(value => {
            this.projectCurrencyBreakDowns.push({
              projectCurrencyBreakDownId: value.projectCurrencyBreakDownId,
              projectId: value.projectId,
              amount: value.amount,
              currency: value.currency,
              exchangeRate: value.exchangeRate
            })
          })
          this.updateTotalValue()
        }
      })

    } else
      console.log(this.projectSearchControl.value)
  }

  resetForm() {
    this.projectId = 0
    this.project.reset()
    this.newFunderFormGroup.reset()
    this.currencyBreakDownFormGroup.reset()
    this.projectFunders = []
    this.projectCurrencyBreakDowns = []

    this.rsdps = []
    this.fundSources = []
    this.fundTypes = []
    this.currencies = []
    this.rsdp = ""
    this.fundSource = ""
    this.fundType = ""
    this.currency = ""
    this.dueDate = ''

    $('#rsdp').val('')
  }

  openDrawer() {
    this.opened = !this.opened
  }

  addProjectFunder() {
    if (this.fundSource == '')
      return
    this.projectFunders.push({
      projectId: (this.projectId == null) ? undefined : this.projectId,
      fundSource: this.fundSource,
      fundType: this.fundType
    })
  }

  removeProjectFunder(funder: string) {
    this.projectFunders = this.projectFunders.filter(value => value.fundSource != funder)
    console.log(this.projectFunders)
  }

  addProjectCurrencyBreakDown() {
    // if (this.currency == '')
    //   return
    let amount = (this.currency != null) ? this.currencyBreakDownFormGroup.value.ExchangeRate * this.currencyBreakDownFormGroup.value.Amount : this.currencyBreakDownFormGroup.value.Amount
    this.projectCurrencyBreakDowns.push({
      projectId: (this.projectId == null) ? undefined : this.projectId,
      amount: amount,
      currency: this.currency,
      exchangeRate: this.currencyBreakDownFormGroup.value.ExchangeRate
    })
    this.updateTotalValue()
    console.log(this.projectCurrencyBreakDowns)
  }

  removeProjectCurrencyBreakDown(currencyBreakDown: ProjectCurrencyBreakDownModel) {
    this.projectCurrencyBreakDowns = this.projectCurrencyBreakDowns.filter(value => value.currency != currencyBreakDown.currency || value.amount != currencyBreakDown.amount)
    this.updateTotalValue()
  }

  save() {
    if (this.projectId == 0)
      this.saveProject()
    else {
      this.updateProject()
    }
  }

  saveProject() {
    this.spinner.show()
    let projectModel: ProjectModel = {
      RSDP: this.rsdp,
      Name: this.project.value.Name,
      Number: this.project.value.Number,
      Description: this.project.value.Description,
      StartDate: this.project.value.StartDate,
      Duration: this.project.value.Duration,
      DueDate: this.dueDate,
      RoadLength: this.project.value.RoadLength,
    }
    console.log(projectModel)
    this.projectService.addProject(projectModel).subscribe({
      next: (response) => {
        console.log(response)
        console.log("Successfully Added")
        this.projectId = response
        this.saveProjectFunder()
        this.saveProjectCurrency()
      },
      error: (err) => {
        this.spinner.hide()
        this.toast.error({detail: "Error Occurred", summary: err.error, duration: 2000})
        console.log(err.error)
        return
      }
    })
  }

  saveProjectFunder() {
    console.log(this.projectFunders)

    let fundSources: ProjectFunderModel[] = []
    this.projectFunders.forEach(funder => {
      fundSources.push({
        projectId: this.projectId,
        fundSource: funder.fundSource,
        fundType: funder.fundType
      })
    })
    fundSources.forEach(funder => {
      this.projectService.addProjectFunder(funder).subscribe({
        error: (err) => {
          this.spinner.hide()
          this.toast.error({detail: "Error Occurred", summary: err.error, duration: 2000})
        }
      })

    })
    console.log("funders: " + fundSources)
  }

  saveProjectCurrency() {
    let projectCurrencies: ProjectCurrencyBreakDownModel[] = []
    this.projectCurrencyBreakDowns.forEach(currencyBreakDown => {
      projectCurrencies.push({
        projectId: this.projectId,
        amount: currencyBreakDown.amount,
        currency: currencyBreakDown.currency,
        exchangeRate: currencyBreakDown.exchangeRate
      })
    })

    projectCurrencies.forEach(currencyBreakDown => {
      this.projectService.addProjectCurrencyBreakDown(currencyBreakDown).subscribe({
        next: () => {
          this.spinner.hide()
          this.toast.success({detail: "Added", summary: "Project Added Successfully", duration: 2000})
          this.getAllProjects()
        },
        error: (err) => {
          this.spinner.hide()
          this.toast.error({detail: "Error Occurred", summary: err.error, duration: 2000})
        }
      })
    })
  }

  amendRow() {
    if (this.currentIndex == -1)
      return
    this.projectCurrencyBreakDowns[this.currentIndex].amount = (this.currency != null) ? this.currencyBreakDownFormGroup.value.ExchangeRate * this.currencyBreakDownFormGroup.value.Amount : this.currencyBreakDownFormGroup.value.Amount
    this.projectCurrencyBreakDowns[this.currentIndex].currency = this.currency
    this.projectCurrencyBreakDowns[this.currentIndex].exchangeRate = this.currencyBreakDownFormGroup.value.ExchangeRate
  }

  currencyRowSelected(index: number) {
    this.currentIndex = index
    $('#amount').val(this.projectCurrencyBreakDowns[index].amount)
    $('#currency').val(this.projectCurrencyBreakDowns[index].currency)
    $('#rate').val(`${this.projectCurrencyBreakDowns[index].exchangeRate}`)
  }

  changeRSDP(e: any) {
    this.rsdp = e.target.value
  }

  changeFundSource(e: any) {
    this.fundSource = e.target.value
  }

  changeFundType(e: any) {
    this.fundType = e.target.value
  }

  changeCurrency(e: any) {
    this.currency = e.target.value
    if (this.currency == "Birr") {
      // @ts-ignore
      document.getElementById("rate").setAttribute("readonly", true)
      console.log(this.currency)
    } else {
      // @ts-ignore
      document.getElementById("rate").removeAttribute("readonly")
      // console.log(this.currency)
    }
  }
}
