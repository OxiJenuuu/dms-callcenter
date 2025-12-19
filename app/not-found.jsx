import "./globals.css";

export default function NotFound(){
    return(
        <main className="min-h-screen w-full flex items-center justify-center select-none">
            <div className="max-w-md w-full text-center px-6">

                <h1 className="text-[96px] font-black text-error tracking-[0.2em]">
                    404
                </h1>

                <p className="text-sm text-base-content/70 leading-relaxed">
                    Pagina aceasta nu exista sau a fost mutata.
                </p>

                <div className="flex justify-center">
                    <a
                        href="/public"
                        className="text-primary font-medium hover:underline hover:cursor-pointer"
                    >
                        Intoarce-te la pagina principala
                    </a>
                </div>

            </div>
        </main>
    )
}