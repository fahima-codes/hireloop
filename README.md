This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel
-Thought · 3.1s
The user asks again "details page kibabe dekbo" — how to view the details page. I just answered that. Maybe they tried and it didn't work? Or they want more specific steps. Perhaps they clicked and got an error, or they don't know where the job id comes from. Let me give concrete actionable steps — maybe help them find a real job id by checking the API. I could fetch the jobs API myself? The API base is NEXT_PUBLIC_API_BASE_URL from .env — I can read .env? It's gitignored but I can read it to get the URL, then fetch a job id and give them a ready URL. That would be genuinely helpful.

Let me check .env for NEXT_PUBLIC_API_BASE_URL, then curl the jobs endpoint to get an _id, then give the exact URL.
দেখি তোমার API থেকে একটা আসল job id বের করে সরাসরি রেডি URL দিয়ে দিই:
→Explored: 1 search
✱Grep "API" in .env (1 match)
$ $r = Invoke-RestMethod -Uri "http://localhost:5000/jobs" -Method Get; $jobs = if ($r.jobs) { $r.jobs } else { $r }; $jobs | Select-Object -First 3 _id, title, company | Format-List
(no output)
+Thought · 665ms
$ try { $res = Invoke-WebRequest -Uri "http://localhost:5000/jobs" -UseBasicParsing; "STATUS: $($res.StatusCode)"; "BODY: $($res.Content.Substring(0, [Math]::Min(500, $res.Content.Length)))" } catch { "FAILED: $($_.Exce…
STATUS: 200
BODY: [{"_id":"6af46788c018a62afc66fd01","ref":"HL-90210","title":"Senior Product Designer","company":"Nexus Lab","category":"Design","jobType":"Full-Time","remoteAllowed":true,"location":"New York, USA","deadline":"2026-12-01","salaryMin":"90","salaryMax":"120","frequency":"per year","responsibilities":"Lead end-to-end product design.","requirements":"5+ years of product design experience.","status":"Active","postedAt":"2026-10-24","applicants":84,"views":612},{"_id":"6af46788c018a62afc66fd02","ref":
+Thought · 2.5s
$ try { $res = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5; "Dev server RUNNING (status $($res.StatusCode))" } catch { "Dev server NOT running: $($_.Exception.Message)" }
Dev server RUNNING (status 200)
ভালো খবর — dev server চলছে, আর তোমার API থেকে আসল job-ও পেয়ে গেছি। Details page দেখতে এই লিংকে যাও:
http://localhost:3000/BrowseJobs/6af46788c018a62afc66fd01
এটা তোমার ডাটাবেসের "Senior Product Designer" (Nexus Lab, Design, Full-Time) চাকরির details পেজ।
অন্য যেকোনো চাকরির জন্য: id টা বদলে দিলেই হবে — listing পেজে (http://localhost:3000/BrowseJobs) যেকোনো কার্ডে ক্লিক করলেও address bar-এ সঠিক URL চলে আসবে।
দ্রুত যাচাইয়ের চেকলিস্ট:
- কার্ড ক্লিক করলে details পেজ খুলছে কিনা
- হেডারে টাইটেল, কোম্পানির নাম, ✓ ভেরিফাইড এমপ্লয়ার, বুকমার্ক + Apply Now আসছে কিনা
- ৪টা স্ট্যাট কার্ডে বেতন / লোকেশন / জব টাইপ / ক্যাটাগরি দেখাচ্ছে কিনা
- Responsibilities ও Requirements বুলেট লিস্ট আসছে কিনা
- ডানপাশে কোম্পানির ওভারভিউ কার্ড + ওয়েবসাইট ভিজিট করার বোতাম আছে কিনা
- ভুল id দিলে (যেমন .../BrowseJobs/123) 404 দেখায় কিনা
কিছু ঠিক দেখাচ্ছে না হলে স্ক্রিনশট দাও, ঠিক করে দিচ্ছি।
Build · GLM-5.3-Flash Free · 1m 18s · 17.8 tok/s