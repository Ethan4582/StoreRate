import { Activity, DraftingCompass, Mail, Zap } from 'lucide-react'
import Image from 'next/image'

export default function FeaturesSection() {
    return (
        <section className="py-16 md:py-32 bg-[var(--background)] dark:bg-[var(--background)]">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
                    <div className="lg:col-span-2">
                        <div className="md:pr-6 lg:pr-0">
                            <h2 className="text-4xl font-semibold lg:text-5xl text-[var(--primary)] dark:text-[var(--primary)]">Built for Scaling Teams</h2>
                            <p className="mt-6 text-[var(--foreground)] dark:text-[var(--foreground)]">
                                Empower your team with StoreRate’s robust features, seamless support, and real-time analytics for smarter business decisions.
                            </p>
                        </div>
                        <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
                            <li>
                                <Mail className="size-5 text-[var(--primary)]" />
                                <span className="text-[var(--foreground)] dark:text-[var(--foreground)]">Email and web support</span>
                            </li>
                            <li>
                                <Zap className="size-5 text-[var(--primary)]" />
                                <span className="text-[var(--foreground)] dark:text-[var(--foreground)]">Fast response time</span>
                            </li>
                            <li>
                                <Activity className="size-5 text-[var(--primary)]" />
                                <span className="text-[var(--foreground)] dark:text-[var(--foreground)]">Monitoring and analytics</span>
                            </li>
                            <li>
                                <DraftingCompass className="size-5 text-[var(--primary)]" />
                                <span className="text-[var(--foreground)] dark:text-[var(--foreground)]">Architectural review</span>
                            </li>
                        </ul>
                    </div>
                    <div className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3">
                        <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-[var(--muted)] to-transparent p-px dark:from-[var(--muted)]">
                            <Image src="/feat.png" className="hidden rounded-[15px] dark:block" alt="payments illustration dark" width={1207} height={929} />
                            <Image src="/feat.png" className="rounded-[15px] shadow dark:hidden" alt="payments illustration light" width={1207} height={929} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}