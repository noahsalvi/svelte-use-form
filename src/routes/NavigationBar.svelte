<script lang="ts">
  const examplePaths = [
    "login",
    "reset-form",
    "async",
    "reuse-form",
    "dynamic-typing",
    "dynamic-form",
    "multi-forms",
    "ignore-attribute",
  ];

  const getTitle = (path: string) => {
    const words = path.split("-");
    const wordsUppercased = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return wordsUppercased.join(" ");
  };
</script>

<nav>
  <h1>Svelte Use Form</h1>
  Examples:
  <ul>
    {#each examplePaths as examplePath}
      <li><a href="/examples/{examplePath}">{getTitle(examplePath)}</a></li>
    {/each}
  </ul>
</nav>

<style>
  nav {
    padding: 0 30px;
    display: flex;
    align-items: center;
    widows: 100%;
    background: rgb(0, 0, 0);
    color: white;
  }

  ul {
    display: flex;
  }

  li {
    margin-right: 30px;
    list-style: none;
  }
  a {
    color: white;
  }

  h1 {
    margin-right: 100px;
  }
</style>
