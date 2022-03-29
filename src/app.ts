import express, { NextFunction, Request, Response } from 'express'
import gode, { EngLayout, ThaLayout } from 'gode.js'
import cors from 'cors'
import * as utils from './utils'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.redirect('https://github.com/godeProject/godeAPI')
})

app.get('/v1/getans/', (req: Request, res: Response) => {
    try {
        let ans = gode.qwkm(req.query.phrase as string)
        res.status(200).json({
            'status': 200,
            'original': req.query.phrase,
            'results': ans
        })
    }
    catch {
        if (!req.query.phrase) {
            res.status(400).json({
                'status': 400,
                'Error': 'Missing Argument'
            })
        }
        else {
            res.status(500).json({
                'status': 500,
                'Error': 'Internal Server Error'
            })
        }
    }

})

app.get('/v2/convert/:englayout/:thalayout/', (req: Request, res: Response) => {
    try {
        let parameter = req.params
        let validity = utils.validateKeyboardLayout(parameter.englayout as string, parameter.thalayout as string)
        if (validity.isEngValid && validity.isThaValid) {
            let ans = gode.convert(parameter.englayout as EngLayout, parameter.thalayout as ThaLayout, req.query.message as string)
            res.status(200).json({
                'status': 200,
                'original': req.query.message as string,
                'results': ans
            })
        }
        else {
            res.status(400).json({
                'status': 400,
                'Error': 'Bad Request'
            })
        }

    }
    catch {
        if (!req.params || !req.query.message) {
            res.status(400).json({
                'status': 400,
                'Error': 'Missing Argument'
            })
        }
        else {
            res.status(500).json({
                'status': 500,
                'Error': 'Internal Server Error'
            })
        }
    }

})

app.post('/v2/raw', (req: Request, res: Response) => {
    try {
        let body = req.body
        let validity = utils.validateKeyboardLayout(body.engLayout as string, body.thaLayout as string)
        if (validity.isEngValid && validity.isThaValid) {
            let ans = gode.convert(body.engLayout as EngLayout, body.thaLayout as ThaLayout, body.message)
            res.status(200).json({
                'status': 200,
                'original': body.message,
                'results': ans
            })
        }
        else {
            res.status(400).json({
                'status': 400,
                'Error': 'Bad Request'
            })
        }
    }
    catch {
        if (!req.body) {
            res.status(400).json({
                'status': 400,
                'Error': 'Missing Body'
            })
        }
        else {
            res.status(500).json({
                'status': 500,
                'Error': 'Internal Server Error'
            })
        }
    }

})

//404
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        'status': 404,
        'Error': `Cannot find route ${req.path} on this server.`
    })
})

//500
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
    res.status(500).json({
        'status': 500,
        'Error': 'Internal Server Error'
    })
})

app.listen(port, () => {
    console.log(`Api listening on port ${port}`)
})