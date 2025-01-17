import fs from 'fs/promises'
import path from 'path'
import { parse } from 'csv-parse/sync'

export interface Domain {
  domain: string
  niche1: string
  niche2: string
  traffic: string
  dr: number
  da: number
  language: string
  price: string
  spamScore: string
}

export async function fetchDomains(): Promise<Domain[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', '/ri.csv')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    })

    return records.map((record: any) => ({
      domain: record.Domain || '',
      niche1: record['Niche 1'] || '',
      niche2: record['Niche 2'] || '',
      traffic: record.Traffic || '',
      dr: parseInt(record.DR) || 0,
      da: parseInt(record.DA) || 0,
      language: record.Language || '',
      price: record.Price || '',
      spamScore: record['Spam Score'] || ''
    }))
  } catch (error) {
    console.error('Error fetching domains:', error)
    return []
  }
}

