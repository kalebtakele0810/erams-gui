import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ProjectSearchModel} from "../../models/ProjectSearchModel";
import {ProjectService} from "../services/project.service";
import {Contract} from "../../models/Contract";
import {ContractService} from "../services/contract.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ContractConstants} from "../util/contract.constants";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.css']
})
export class AddContractComponent implements OnInit {

  contractFormGroup = new FormGroup({
    projectName: new FormControl(),
    designContract: new FormControl(),
    workContract: new FormControl(),
    designAndBuildContract: new FormControl(),
    contractNumber: new FormControl(),
    contractName: new FormControl(),
    budgetYear: new FormControl(),
    budget: new FormControl(),
  })

  opened: boolean = false

  projectSearchControl = new FormControl()
  contractSearchControl = new FormControl()

  projectId: number = 0
  contractId: number = 0

  projectSearches: ProjectSearchModel[] = []
  contractSearches: Contract[] = []
  filteredOptions: ProjectSearchModel[] = []
  filteredContracts: Contract[] = []
  contracts: Contract[] = []
  designContracts: Contract[] = []
  workContracts: Contract[] = []
  designAndBuildContracts: Contract[] = []


  contractTypes: string[] = []

  contractType: string = ''

  displayAssociatedDesignContract: boolean = false
  displayAssociatedWorksContract: boolean = false
  displayAssociatedDesignAndBuildContract: boolean = false

  constructor(
    private projectService: ProjectService,
    private contractService: ContractService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.initForm()
    this.getAllProjects()
    console.log(this.projectSearches)
    console.log(this.filteredOptions)
    this.getAllContractTypes()
    this.getAllContracts()
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

  getAllContracts() {
    this.contractService.getAllContracts().subscribe({
      next: (response) => {
        this.contractSearches = response
        this.filteredContracts = response
      },
      error: err => {
        console.log(err.error)
      }
    })
  }

  getAllContractTypes() {
    this.contractService.getAllContractTypes().subscribe({
      next: (response) => {
        this.contractTypes = response
      }
    })
  }

  getAllProjectContracts() {
    if (this.projectId == 0)
      return
    this.contractService.getAllProjectContracts(this.projectId).subscribe({
      next: (response) => {
        this.contracts = response
        console.log(this.contracts)
      },
      error: (err) => {
        console.log(err.error)
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
    this.contractSearchControl.valueChanges.subscribe({
      next: (response) => {
        this.filterContracts(response)
      }
    })
  }

  filterContracts(filteredData: string) {
    this.filteredContracts = this.contractSearches.filter(value => {
      return value.contractName.toLowerCase().indexOf(filteredData.toLowerCase()) > -1
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

  displayContract(contract: Contract): string {
    return contract && contract.contractName ? contract.contractName : '';
  }

  save() {
    if (this.projectId == 0)
      return
    this.saveContract()
  }

  saveContract() {
    this.spinner.show('save')
    let designId = (this.contractFormGroup.value.designContract == null) ? null : this.contractFormGroup.value.designContract.contractId
    let workId = (this.contractFormGroup.value.workContract == null) ? null : this.contractFormGroup.value.workContract.contractId

    let contract: Contract = {
      projectId: this.projectId,
      designContractId: designId,
      workContractId: workId,
      contractName: this.contractFormGroup.value.contractName,
      contractNumber: this.contractFormGroup.value.contractNumber,
      contractType: this.contractType,
      budget: this.contractFormGroup.value.budget,
      budgetYear: this.contractFormGroup.value.budgetYear,
    }
    console.log(contract)
    console.log(this.contractFormGroup.value.designContract)
    this.contractService.addProjectContract(contract).subscribe({
      next: () => {
        this.spinner.hide('save')
        this.toast.success("Success", "Successfully Added")
        this.getAllProjectContracts()
        this.getAllDesignContracts()
        this.getAllDesignAndBuildContracts()
      },
      error: (err) => {
        this.spinner.hide('save')
        this.toast.error("Error Occurred", "Error")
        console.log("save error")
        console.log(err.error.title)
      }
    })
  }

  openContract() {
    this.opened = !this.opened

    if (this.contractSearchControl.value.contractId != null) {
      this.contractId = this.contractSearchControl.value.contractId
      console.log(this.contractSearchControl.value)
      this.contractService.getContractById(this.contractId).subscribe({
        next: (response) => {
          this.contractFormGroup.patchValue({
            contractNumber: response.contractNumber,
            contractName: response.contractName,
            budgetYear: response.budgetYear,
            budget: response.budget,
          })
          this.changeContractType(null, response.contractType)
          this.projectId = (response.projectId == undefined) ? 0 : response.projectId
          this.getAllProjectContracts()
          console.log("Design id", response.designContractId)
          if (response.designContractId != null)
            this.contractService.getContractById(response.designContractId).subscribe({
              next: value => {
                this.contractFormGroup.value.designContract = value.contractName
                console.log(value.contractName)
                $('#associatedDesignContract').val(value.contractName)
              }
            })
        }
      })

    }
  }

  openDrawer() {
    this.opened = !this.opened
  }

  resetForm() {
    this.contractFormGroup.reset()
    this.projectSearchControl.reset()
    this.contractSearchControl.reset()
    this.projectId = 0
    this.contractId = 0
    this.projectSearches = []
    this.filteredOptions = []
    this.contracts = []
    this.designContracts = []
    this.workContracts = []
    this.designAndBuildContracts = []
    this.contractTypes = []
    this.contractType = ''
    this.displayAssociatedDesignContract = false
    this.displayAssociatedWorksContract = false
    this.displayAssociatedDesignAndBuildContract = false
  }

  projectChanged(project: ProjectSearchModel) {
    this.projectId = project.projectId
    console.log("Project id : ", this.projectId)
    this.getAllProjectContracts()
  }

  changeContractType(event: any, type?: string) {
    if (event != null) {
      this.contractType = event.target.value
    }
    if (type != null) {
      this.contractType = type
      $('#contractType').val(this.contractType)
    }
    this.displayAssociatedDesignContract = ContractConstants.associatedDesignContracts.indexOf(this.contractType) > -1;
    this.displayAssociatedDesignAndBuildContract = ContractConstants.associatedDesignAndBuildContracts.indexOf(this.contractType) > -1

    if (this.displayAssociatedDesignContract)
      this.getAllDesignContracts()
    if (this.displayAssociatedDesignAndBuildContract)
      this.getAllDesignAndBuildContracts()
  }

  getAllDesignContracts() {
    this.contractService.getAllContractsByType("Design").subscribe({
      next: value => {
        this.designContracts = value
      },
      error: err => this.toast.error("Error Occurred", "Unable to load associated contracts")
    })
  }

  getAllDesignAndBuildContracts() {
    this.contractService.getAllContractsByType("Design and Build").subscribe({
      next: value => this.designAndBuildContracts = value,
      error: err => this.toast.error("Error Occurred", "Unable to load associated contracts")
    })
  }
}
