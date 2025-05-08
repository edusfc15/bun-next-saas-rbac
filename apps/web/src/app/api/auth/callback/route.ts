import { signInWithGithub } from "@/app/http/sign-in-with-github";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')

    if (!code) {
        return NextResponse.json({ error: 'Github oAuth code was not found' }, { status: 400 })
    }

    const { token } = await signInWithGithub({ code })

    const cookieStore = await cookies()

    cookieStore.set('token', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    })

    const redirectURL = request.nextUrl.clone()
    redirectURL.pathname = '/'
    redirectURL.search = ''

    return NextResponse.redirect(redirectURL)

}