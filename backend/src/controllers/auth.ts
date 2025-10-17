import { Request, Response } from "express";

function passwordSignIn(req: Request, res: Response) {  

}

function passwordSignUp(req: Request, res: Response) {

}

function googleSignIn(req: Request, res: Response) {

}

function googleCallback(req: Request, res: Response) {

}

function facebookSignIn(req: Request, res: Response) {

}

function facebookCallback(req: Request, res: Response) {

}

const auth = {
    passwordSignUp,
    passwordSignIn,
    googleSignIn,
    googleCallback,
    facebookSignIn,
    facebookCallback
}

export default auth;