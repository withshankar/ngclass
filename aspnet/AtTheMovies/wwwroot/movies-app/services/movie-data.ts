import {Http} from "angular2/http";
import {Movie} from "../movie";
import {Injectable} from "angular2/core";
import "rxjs/add/operator/map";
import {RequestOptions, Headers} from "angular2/http";

let parseResponse = (response) => response.json();

let getJsonOptions = function() {
    let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append("Content-Type", "application/json");
    return options;
}

@Injectable()
export class MovieData {
    private _baseUrl = "/movies";

    constructor(private http: Http) {
    }

    create(movie: Movie) {
        return this.http.post(this._baseUrl, 
                            JSON.stringify(movie), 
                            getJsonOptions())
                   .map(parseResponse)
                   .map(movie => new Movie(movie.id, movie.title, movie.rating, movie.length));
    }

    update(movie: Movie) {


        return this.http.put(this._baseUrl, 
                            JSON.stringify(movie), 
                            getJsonOptions())
            .map(parseResponse)
            .map(movie => new Movie(movie.id, movie.title, movie.rating, movie.length));
    }

    getById(id: number) {
        return this.http.get(`${this._baseUrl}/${id}`)
            .map(parseResponse)
            .map(movie => new Movie(movie.id, movie.title, movie.rating, movie.length));
    }

    getAll() {
        return this.http.get(this._baseUrl)
            .map(parseResponse)
            .map(array => array.map(o => new Movie(o.id, o.title, o.rating, o.length)));

    }
}

// export abstract class MovieData
// {
//     abstract getAll(): Observable<Movie[]>;
//     abstract getById(id: number): Observable<Movie>;
// }

// export class HttpMovieData implements MovieData
// {
//     constructor(private http: Http)
//     {
//         
//     }
//     
//     getById(id) {
//         
//     }
//     
//     getAll() {
//         return this.http.get("/movies")
//                  
//     }
// }

// @Injectable()
// export class InMemoryMovieData implements MovieData
// {
//     private movies: Movie[];
//     
//     constructor(private http: Http) {
//                              
//         this.movies = [
//             new Movie(1, "Star Wars", 5, 120),
//             new Movie(2, "Star Trek", 5, 100),
//             new Movie(3, "Starship Troopers", 3, 90)
//         ];
//     }
//     
//     getById(id: number) {
//         for(let movie of this.movies) {
//             if(movie.id == id) {
//                return Observable.just(movie);
//             }
//         }
//         return null;
//     }
//     
//     getAll() {
//         return Observable.from(this.movies, null) 
//     }
// }