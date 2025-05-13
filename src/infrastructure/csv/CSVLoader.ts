import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse'
import { ProducerAward } from '../../domain/entities/ProducerAward'
import { parseCsvLineToProducerAward } from '../../shared/parseProducerAward'

export class CSVLoader{

    static async load(filePath: string):Promise<ProducerAward[]>{
        return new Promise((resolve, reject) => {

            const results: ProducerAward[] = []

            fs.createReadStream(filePath)
            .pipe(parse({columns: true, delimiter: ';', trim: true}))
            .on('data', (data)=> {
                try{
                    const parsed = parseCsvLineToProducerAward(data)
                    results.push(parsed)
                }catch (error){
                    console.warn('Erro ao processar linha do CSV:', data)
                }
            })
            .on('end', () => {
                resolve(results)
            })
            .on('error', (err) => {
                reject(err)
            })
        })
    }

}