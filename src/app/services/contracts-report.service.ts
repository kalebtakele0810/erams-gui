import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Constants} from "../util/constants";
import {Observable} from "rxjs";
import {ContractReportModel} from "../../models/ContractReportModel";

@Injectable({
  providedIn: 'root'
})
export class ContractsReportService {
  baseUrl: string = `${Constants.baseUrl}/report/contracts`

  constructor(private http: HttpClient) {
  }

  getReport(startDate: string, endDate: string): Observable<ContractReportModel[]> {
    return this.http.get<ContractReportModel[]>(`${this.baseUrl}/${startDate}/${endDate}`, { headers: Constants.headers })
  }
}
