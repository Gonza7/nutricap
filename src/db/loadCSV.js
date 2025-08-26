import { addAlimento, clearAlimentos } from './indexedDB'
import Papa from 'papaparse'

export const loadCSVToDB = async () => {
  try {
    const response = await fetch('/alimentos.csv')
    const csvText = await response.text()

    const results = Papa.parse(csvText, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true
    })

    await clearAlimentos()
    for (const row of results.data) {
      await addAlimento(row)
    }

    console.log('CSV cargado en IndexedDB')
  } catch (error) {
    console.error('Error cargando CSV:', error)
  }
}
