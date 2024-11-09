<script lang="ts">
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import * as Card from '$lib/components/ui/card';
  import { Switch } from '$lib/components/ui/switch';
  import * as Table from '$lib/components/ui/table/index.js';
  import type { PageData } from './$types';

  export let data: PageData;

  let value = 'img';

  let checked = true;
</script>

<svelte:head>
  <title>Laporan</title>
</svelte:head>

<main class="mt-8 pt-2 sm:container mx-2 sm:mx-auto pb-10">
  <h1 class="text-center mt-2">Jumlah Dataset</h1>
  <div class="flex flex-col items-center justify-center w-full">
    <Tabs.Root
      {value}
      class="w-full"
      onValueChange={(v) => {
        value = v ?? 'img';
      }}
    >
      <Tabs.List class="grid w-full grid-cols-2">
        <Tabs.Trigger value="img">Img</Tabs.Trigger>
        <Tabs.Trigger value="txt">Txt</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="img">
        <Card.Root>
          <Card.Header>
            <Card.Title>Jumlah</Card.Title>
            <p>Data Train: {data.img.sum_train}</p>
            <p>Data Test: {data.img.sum_test}</p>
            <p>Data Total: {data.sum_img}</p>
          </Card.Header>
          <Card.Content class="space-y-2">
            <div class="space-y-4">
              <div class="flex items-center gap-4 my-4">
                <div class={!checked ? '' : 'text-muted-foreground'}>Test</div>
                <Switch bind:checked />
                <div class={checked ? '' : 'text-muted-foreground'}>Train</div>
              </div>
              <Table.Root class="table-fixed">
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Huruf</Table.Head>
                    <Table.Head>Jumlah</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {#each Object.keys(checked ? data.img.train : data.img.test) as letter}
                    <Table.Row>
                      <Table.Cell class="">{letter}</Table.Cell>
                      <Table.Cell colSpan={4} class=""
                        >{checked ? data.img.train[letter] : data.img.test[letter]}</Table.Cell
                      >
                    </Table.Row>
                  {/each}
                </Table.Body>
              </Table.Root>
            </div>
          </Card.Content>
        </Card.Root>
      </Tabs.Content>
      <Tabs.Content value="txt">
        <Card.Root>
          <Card.Header>
            <Card.Title>Jumlah</Card.Title>
            <p>Data Train: {data.txt.sum_train}</p>
            <p>Data Test: {data.txt.sum_test}</p>
            <p>Data Total: {data.sum_txt}</p>
          </Card.Header>
          <Card.Content class="space-y-2">
            <div class="space-y-4">
              <div class="flex items-center gap-4 my-4">
                <div class={!checked ? '' : 'text-muted-foreground'}>Test</div>
                <Switch bind:checked />
                <div class={checked ? '' : 'text-muted-foreground'}>Train</div>
              </div>
              <Table.Root class="table-fixed">
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Huruf</Table.Head>
                    <Table.Head>Jumlah</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {#each Object.keys(checked ? data.txt.train : data.txt.test) as letter}
                    <Table.Row>
                      <Table.Cell class="">{letter}</Table.Cell>
                      <Table.Cell colSpan={4} class=""
                        >{checked ? data.txt.train[letter] : data.txt.test[letter]}</Table.Cell
                      >
                    </Table.Row>
                  {/each}
                </Table.Body>
              </Table.Root>
            </div>
          </Card.Content>
        </Card.Root>
      </Tabs.Content>
    </Tabs.Root>
  </div>
</main>

<style>
  h1 {
    font-size: 2.6666667em;
    margin-top: 0;
    margin-bottom: 0.8333333em;
    line-height: 1;
    font-weight: 800;
  }
</style>
