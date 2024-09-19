# Astro Partials & HTMX

- Projektdetailseite als Partial anlegen
  <https://docs.astro.build/en/basics/astro-pages/#page-partials>
- Projektdetailseite via HTMX laden
  <https://htmx.org/>
- Welcher Trigger <https://htmx.org/attributes/hx-trigger/>?
  Eventuell hx-trigger="my-custom-event from:body"
  <https://htmx.org/attributes/hx-trigger/#triggering-via-the-hx-trigger-header>
- Update Browser history?
  <https://htmx.org/docs/#history>

1. Click on Card

2. Animation scale-up

3. Trigger custom event with slug as event detail: <https://htmx.org/api/#trigger>

  ```js
  htmx.trigger("#project", "load-project", {slug:'my-project-slug'});
  ```

4. Load new project on custom event

5. Start animation of project: <https://htmx.org/events/#htmx:afterSwap>

<https://www.youtube.com/watch?v=S54O8-Yyv3A>
<https://egghead.io/blog/load-an-html-partial-in-astro-using-htmx>

Wie bekommen wir AlpineJS weiterhin am Laufen?
<https://v1.htmx.org/extensions/alpine-morph/>
