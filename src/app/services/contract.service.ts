import {Injectable} from '@angular/core';
import {Constants} from "../util/constants";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Contract} from "../../models/Contract";

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  baseUrl: string = `${Constants.baseUrl}/contracts`

  constructor(private http: HttpClient) {
  }

  getContractById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.baseUrl}/${id}`, {headers: Constants.headers})
  }

  getAllContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.baseUrl}/all`, {headers: Constants.headers})
  }

  addProjectContract(contract: Contract) {
    return this.http.post(`${this.baseUrl}/project/add`, contract, {headers: Constants.headers})
  }

  getAllContractsByType(type: string): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.baseUrl}/type/${type}`, {headers: Constants.headers})
  }

  getAllContractTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/types/all`, {headers: Constants.headers})
  }

  getAllProjectContracts(id: number): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.baseUrl}/project/all/${id}`, {headers: Constants.headers})
  }
}
