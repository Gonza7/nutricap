import { openDB } from 'idb'

const DB_NAME = 'AlimentosDB'
const STORE_NAME = 'alimentos'

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

export const addAlimento = async (alimento) => {
  const db = await initDB()
  return db.add(STORE_NAME, alimento)
}

export const getAllAlimentos = async () => {
  const db = await initDB()
  return db.getAll(STORE_NAME)
}

export const clearAlimentos = async () => {
  const db = await initDB()
  return db.clear(STORE_NAME)
}

export const updateAlimento = async (alimento) => {
  const db = await initDB()
  return db.put(STORE_NAME, alimento) // put reemplaza si existe el id
}

export const deleteAlimento = async (id) => {
  const db = await initDB()
  return db.delete(STORE_NAME, id)
}

export const resetDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase("AlimentosDB")

    request.onsuccess = () => {
      console.log("Base de datos eliminada con éxito")
      resolve()
    }

    request.onerror = (event) => {
      console.error("Error eliminando la base de datos", event)
      reject(event)
    }
  })
}