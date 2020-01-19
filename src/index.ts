import { writeFile } from 'fs'
import { generate } from 'shortid'

import express from "express"
const app = express();

const add = (a: number, b: number): number=> {
  return a + b;
}

app.get('/', (req : any) => {
  (req as any).name = "bob";
  req.name = "bob2";

})

console.log("hello world typescript");