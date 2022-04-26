import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {ProjectModel} from "../../models/ProjectModel";
import {ProjectFunderModel} from "../../models/ProjectFunderModel";
import {ProjectCurrencyBreakDownModel} from "../../models/ProjectCurrencyBreakDownModel";
import {FundSourceModel} from "../../models/FundSourceModel";
import {ProjectSearchModel} from "../../models/ProjectSearchModel";
import FullProjectModel from "../../models/FullProjectModel";
import {Constants} from "../util/constants";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  baseUrl = `${Constants.baseUrl}/projects`

  constructor(private http: HttpClient, private authService: AuthService) {

  }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.authService.getToken()
  });

  addProject(projectModel: ProjectModel): Observable<number> {
    return this.http.post<number>(this.baseUrl + "/add-project", projectModel, {headers: this.headers})
  }

  addFundSourceLookup(source: FundSourceModel) {
    return this.http.post(this.baseUrl + "/add-fund-source-lookup", source, {headers: this.headers})
  }

  addProjectFunder(projectFunderModel: ProjectFunderModel) {
    return this.http.post(this.baseUrl + "/add-project-funders", projectFunderModel, {headers: this.headers})
  }

  addProjectCurrencyBreakDown(projectCurrencyBreakDown: ProjectCurrencyBreakDownModel) {
    return this.http.post(this.baseUrl + "/add-project-currency-breakdown", projectCurrencyBreakDown, {headers: this.headers})
  }

  updateProject(project: FullProjectModel){
    return this.http.put(`${this.baseUrl}/update`, project, { headers: this.headers})
  }

  updateProjectFunder(projectFunders: ProjectFunderModel[]){
    return this.http.put(`${this.baseUrl}/funders/update`, projectFunders, { headers: this.headers })
  }

  updateProjectCurrencies(projectCurrencies: ProjectCurrencyBreakDownModel[]){
    return this.http.put(`${this.baseUrl}/currencies/update`, projectCurrencies, { headers: this.headers })
  }

  getProjectById(id: number): Observable<FullProjectModel> {
    return this.http.get<FullProjectModel>(`${this.baseUrl}/${id}`)
  }

  getProjectFundersById(id: number): Observable<ProjectFunderModel[]>{
    return this.http.get<ProjectFunderModel[]>(`${this.baseUrl}/funders/${id}`, { headers: this.headers })
  }

  getProjectCurrenciesById(id: number): Observable<ProjectCurrencyBreakDownModel[]>{
    return this.http.get<ProjectCurrencyBreakDownModel[]>(`${this.baseUrl}/currencies/${id}`, { headers: this.headers })
  }

  searchProject(name: string): Observable<ProjectSearchModel[]> {
    return this.http.get<ProjectSearchModel[]>(`${this.baseUrl}/search-project/${name}`)
  }

  getAllProjects(): Observable<FullProjectModel[]> {
    return this.http.get<FullProjectModel[]>(`${this.baseUrl}/all`, {headers: this.headers}).pipe(
      map((response: FullProjectModel[]) => response.map(item => item))
    )
  }

  getAllRSDPs(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + "/rsdps", {headers: this.headers});
  }

  getAllFundSources(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + "/fund-sources", {headers: this.headers});
  }

  getAllFundTypes(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + "/fund-types", {headers: this.headers});
  }

  getAllCurrencies(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + "/currencies", {headers: this.headers});
  }
}

