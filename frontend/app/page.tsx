import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  BellRing,
  Bot,
  CircleDollarSign,
  ShieldCheck,
  Sparkles,
  Wallet,
  Users,
  TrendingUp,
  Target,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const floatingNotes = [
  {
    title: 'High spend alert',
    description: 'You spent $320 on dining this month',
    icon: BellRing,
    className: 'left-6 top-20 -rotate-12',
  },
  {
    title: 'Weekly insight',
    description: 'You are 15% under budget',
    icon: TrendingUp,
    className: 'right-8 top-24 rotate-12',
  },
  {
    title: 'Privacy mode',
    description: 'All data processed on-device',
    icon: ShieldCheck,
    className: 'right-10 bottom-28 rotate-[-10deg]',
  },
  {
    title: 'Subscription',
    description: 'Netflix · $15',
    icon: CircleDollarSign,
    className: 'left-10 bottom-32 rotate-12',
  },
];

const people = [
  {
    name: 'Yonten',
    role: 'Freelancer',
    initials: 'YK',
    quote: 'I needed a fast way to see client income versus daily spending without opening spreadsheets.',
  },
  {
    name: 'Maya',
    role: 'Student',
    initials: 'MA',
    quote: 'The monthly view makes rent, food, and subscriptions feel manageable instead of messy.',
  },
  {
    name: 'Arun',
    role: 'Creator',
    initials: 'AR',
    quote: 'I can log expenses quickly and move back to work. That matters when ideas are moving fast.',
  },
];

const featureRows = [
  {
    title: 'See your money clearly',
    description:
      'Understand where your money goes with charts, categories, and a clean monthly breakdown.',
    icon: BarChart3,
  },
  {
    title: 'Stay in control',
    description:
      'Add expenses in seconds and keep your budget visible before small costs become bad habits.',
    icon: Target,
  },
  {
    title: 'Private by default',
    description:
      'JWT-backed auth keeps every record tied to the right account and not shared between users.',
    icon: ShieldCheck,
  },
];

const stats = [
  { value: '12+', label: 'Categories tracked' },
  { value: '3', label: 'People-centered views' },
  { value: 'Minutes', label: 'Setup time' },
];

const miniFeed = [
  { name: 'Grocery Store', amount: '-$84.20', meta: 'Auto-categorized', tone: 'bg-blue-500/15 text-blue-700' },
  { name: 'Coffee Shop', amount: '-$6.50', meta: 'High spend alert', tone: 'bg-rose-500/15 text-rose-700' },
  { name: 'Client Payment', amount: '+$540.00', meta: 'Income added', tone: 'bg-emerald-500/15 text-emerald-700' },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#f7fbff_0%,_#eef7ff_36%,_#dff4ff_62%,_#eef2ff_100%)] text-slate-900">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.85)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.85)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />
      <div className="absolute left-[-6rem] top-[-6rem] h-[30rem] w-[30rem] rounded-full bg-sky-300/25 blur-3xl" />
      <div className="absolute right-[-8rem] top-[8rem] h-[26rem] w-[26rem] rounded-full bg-cyan-300/25 blur-3xl" />
      <div className="absolute bottom-[-8rem] left-[22%] h-[26rem] w-[26rem] rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-6 lg:px-10 lg:py-6">
        <header className="flex items-center justify-between rounded-[1.75rem] border border-white/70 bg-white/70 px-5 py-4 shadow-[0_12px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/25">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.35em] text-slate-500">
                Expense Tracker
              </p>
              <p className="text-lg font-semibold text-slate-900">ExpenseIQ</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <Link href="#features" className="transition-colors hover:text-slate-900">Features</Link>
            <Link href="#people" className="transition-colors hover:text-slate-900">People</Link>
            <Link href="#security" className="transition-colors hover:text-slate-900">Security</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="hidden text-slate-600 hover:text-slate-900 md:inline-flex">
              <Link href="/dashboard">Login</Link>
            </Button>
            <Button asChild className="rounded-full bg-slate-900 px-5 text-white shadow-lg shadow-slate-900/15 hover:bg-slate-800">
              <Link href="/dashboard">
                Join waitlist
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        <section className="relative grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:py-14">
          <div className="max-w-2xl pt-4 lg:pt-8">
            <Badge className="mb-6 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <Sparkles className="mr-2 h-3.5 w-3.5 text-sky-500" />
              Join the beta waitlist
            </Badge>

            <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-balance text-slate-950 sm:text-6xl lg:text-7xl">
              Stop guessing.
              <br />
              Start tracking.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              A brighter, beginner-friendly expense tracker that shows people where their money goes, who it matters to, and what they can do next.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center rounded-full border border-slate-200 bg-white p-2 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
                <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2 text-slate-500">
                  <Users className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="truncate">Enter your email</span>
                </div>
                <Button asChild className="rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800">
                  <Link href="/dashboard">Join waitlist</Link>
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <div className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 shadow-sm">
                <span className="text-slate-900">★★★★★</span>
                <span>Join 1,200+ beta testers</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 shadow-sm">
                <Bot className="h-4 w-4 text-sky-500" />
                <span>Designed for quick, low-friction use</span>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <Card key={item.label} className="border-white/70 bg-white/80 shadow-[0_18px_55px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                  <CardContent className="pt-6">
                    <p className="text-3xl font-semibold text-slate-900">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-500">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative min-h-[780px] lg:min-h-[840px]">
            {floatingNotes.map((note, index) => {
              const Icon = note.icon;
              return (
                <Card
                  key={note.title}
                  className={`absolute z-20 w-[190px] border-white/80 bg-white/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl ${note.className}`}
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      Note {index + 1}
                    </div>
                    <p className="text-sm font-medium text-slate-900">{note.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{note.description}</p>
                  </CardContent>
                </Card>
              );
            })}

            <div className="absolute inset-x-0 bottom-0 top-16 rounded-[2.5rem] border border-white/80 bg-white/45 shadow-[0_25px_80px_rgba(15,23,42,0.1)] backdrop-blur-2xl" />

            <div className="absolute left-1/2 top-24 z-10 w-[250px] -translate-x-1/2 rounded-[2.5rem] border-[10px] border-slate-950 bg-slate-950 p-2 shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
              <div className="rounded-[2rem] bg-gradient-to-b from-sky-200 via-sky-100 to-white px-4 pb-4 pt-3">
                <div className="mb-4 flex items-center justify-between text-[10px] font-medium text-slate-500">
                  <span>8:00</span>
                  <span className="flex items-center gap-1">
                    <span>•••</span>
                    <span>5G</span>
                    <span>100%</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-3 shadow-sm">
                  <Avatar className="h-10 w-10 border border-white">
                    <AvatarFallback className="bg-sky-100 font-semibold text-sky-700">IM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-slate-500">Good morning</p>
                    <p className="font-semibold text-slate-900">Imran</p>
                  </div>
                </div>
                <div className="mt-8 rounded-[1.6rem] bg-white/85 px-4 py-5 shadow-sm">
                  <p className="text-sm text-slate-500">Hello, Imran</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">ExpenseIQ</p>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Your spending, organized in a way that actually feels easy.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-7 bottom-8 z-20 rounded-[2rem] border border-sky-100 bg-sky-400/70 p-3 shadow-[0_18px_50px_rgba(37,99,235,0.22)] backdrop-blur-xl">
              <div className="grid gap-2">
                {miniFeed.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-[1.25rem] bg-white/18 px-4 py-3 text-white shadow-sm">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-white/75">{item.amount} • {item.meta}</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/18 text-white">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="features" className="absolute left-3 top-[440px] z-20 w-[212px] -rotate-12 rounded-[1.6rem] border border-white/80 bg-white/90 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">High Spend Alert</p>
              <p className="mt-2 text-sm text-slate-700">You spent $320 on dining this month</p>
            </div>

            <div className="absolute right-5 top-[420px] z-20 w-[212px] rotate-12 rounded-[1.6rem] border border-white/80 bg-white/90 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Weekly Insight</p>
              <p className="mt-2 text-sm text-slate-700">You are 15% under budget</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 pb-16 lg:grid-cols-3">
          {featureRows.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-white/70 bg-white/80 shadow-[0_18px_55px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                <CardHeader>
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-7 text-slate-500">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </section>

        <section id="people" className="grid gap-4 pb-16 lg:grid-cols-3">
          {people.map((person) => (
            <Card key={person.name} className="border-white/70 bg-white/80 shadow-[0_18px_55px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-slate-100">
                    <AvatarFallback className="bg-slate-900 font-semibold text-white">
                      {person.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-slate-900">{person.name}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{person.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">“{person.quote}”</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section id="security" className="pb-4">
          <Card className="border-white/70 bg-white/80 shadow-[0_18px_55px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">Security</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Private by default, simple for beginners.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                  Clear labels, direct actions, and a friendly layout reduce friction while keeping every account protected.
                </p>
              </div>
              <Button asChild className="rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800">
                <Link href="/dashboard">
                  Open the app
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
