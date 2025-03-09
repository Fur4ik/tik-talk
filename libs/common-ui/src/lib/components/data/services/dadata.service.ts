import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs'
import { DadataSuggestions } from '../interfaces/dadata-suggestions.interface'

@Injectable({
  providedIn: 'root'
})
export class DadataService {
  #http = inject(HttpClient)

  #apiUrl = 'http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
  #token = '141f38ef6a14ef4b325013a5cfd483973e5ed5ec'

  getSuggestion(query: string) {
    return this.#http.post<{ suggestions: DadataSuggestions[] }>(this.#apiUrl, { query }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.#token}`
      }
    })
      .pipe(
        map((res) =>
            res.suggestions
        )
      )
  }
}
