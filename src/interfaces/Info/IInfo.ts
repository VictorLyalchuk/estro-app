export interface IInfo {
    id: string;
    name: string; 
    options: IOptions [] | null;

}
export interface IOptions {
    id: string;
    label: string; 
    value: string;
}