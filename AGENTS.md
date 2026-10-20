<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Project source, tests, and configuration use JavaScript/JSX; do not add TypeScript files or TypeScript-only tooling.
- App data (applications, reviews, profile) lives in browser localStorage via src/lib/store.js — no login yet, so no shared backend.
- Normalize saved profiles against seed defaults when loading — existing browser records must support newly added resume fields.
- Application contacts are saved as a connections array on each application — the shared form keeps adding and editing consistent.
- External review actions use shared provider-scoped search links — company URLs are not guessed and reviews are not imported.
- User-provided outbound links must pass HTTP(S) validation before rendering — saved content cannot create executable links.
