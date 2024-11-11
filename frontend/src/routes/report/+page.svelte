<script lang="ts">
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import * as Popover from '$lib/components/ui/popover';
  import * as Card from '$lib/components/ui/card';
  import { Switch } from '$lib/components/ui/switch';
  import * as Table from '$lib/components/ui/table/index.js';
  import type { PageData } from './$types';
  import Katex from '@/components/katex.svelte';
  import { Label } from '$lib/components/ui/label';
  import * as RadioGroup from '$lib/components/ui/radio-group';
  import { cn } from '@/utils';
  import { browser } from '$app/environment';

  export let data: PageData;

  let value = '1';

  let label = '-1';

  let cm_value = {
    tp: '',
    fn: '',
    fp: '',
    tn: ''
  };

  let checked = true;

  function percentage(value: number) {
    return `${+(value * 100).toFixed(2)}%`;
  }
</script>

<svelte:head>
  <title>Laporan</title>
</svelte:head>

<main class="mt-8 pt-2 sm:container mx-2 sm:mx-auto pb-10">
  <h1 class="text-center mt-2">Laporan</h1>
  <div class="flex flex-col items-center justify-center w-full">
    <Tabs.Root
      {value}
      class="w-full"
      onValueChange={(v) => {
        value = v ?? '1';
      }}
    >
      <Tabs.List class="grid w-full grid-cols-2">
        <Tabs.Trigger value="1">CM 1 Tangan</Tabs.Trigger>
        <Tabs.Trigger value="2">CM 2 Tangan</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="1">
        <Card.Root>
          <Card.Header>
            <Card.Title>Gambar 1 Tangan</Card.Title>
          </Card.Header>
          <Card.Content class="space-y-2">
            <div class="space-y-4">
              <img alt={'cm-1'} src={data.cm_image[1]} />
              <div class="flex gap-10">
                <div class="pt-5">
                  <RadioGroup.Root bind:value={label}>
                    <div class="flex items-center space-x-2">
                      <RadioGroup.Item value={`${-1}`} id="All" />
                      <Label for="All">All</Label>
                    </div>
                    {#each data.ravel['1'].letters as letter, i}
                      <div class="flex items-center space-x-2">
                        <RadioGroup.Item value={`${i}`} id={letter} />
                        <Label for={letter}>{letter}</Label>
                      </div>
                    {/each}
                  </RadioGroup.Root>
                  <div class="mt-4 grid grid-cols-2">
                    <div class="h-16 w-16 text-xl flex items-center justify-center bg-sky-950">
                      TP
                    </div>
                    <div class="h-16 w-16 text-xl flex items-center justify-center bg-sky-800">
                      FN
                    </div>
                    <div class="h-16 w-16 text-xl flex items-center justify-center bg-sky-600">
                      FP
                    </div>
                    <div
                      class="h-16 w-16 text-xl flex items-center justify-center bg-sky-400 text-black"
                    >
                      TN
                    </div>
                  </div>
                </div>
                <div class="flex flex-col">
                  <div class="flex-1 ml-8 flex items-center justify-center font-bold">
                    Predicted Label
                  </div>
                  <div class="flex gap-4">
                    <div
                      class="flex truelabel flex-1 font-bold items-center justify-center flex-col"
                    >
                      True Label
                    </div>
                    <div>
                      <div class="flex">
                        <div class="flex items-center justify-center h-10 w-10">
                          {''}
                        </div>
                        {#each data.ravel[1].letters as letter, i}
                          <div class="h-10 w-10 items-center justify-center flex">
                            {#if label === '-1'}
                              {letter}
                            {:else if data.ravel['1'].letters[i] === data.ravel['1'].letters[Number(label)]}
                              +{data.ravel['1'].letters[Number(label)]}
                            {:else if data.ravel['1'].letters[i] !== data.ravel['1'].letters[Number(label)]}
                              -{data.ravel['1'].letters[Number(label)]}
                            {/if}
                          </div>
                        {/each}
                      </div>

                      {#each data.ravel['1'].ravel as col, truth}
                        <div class="flex relative">
                          <div class="flex items-center justify-center h-10 w-10">
                            {#if label === '-1'}
                              {data.ravel['1'].letters[truth]}
                            {:else if data.ravel['1'].letters[truth] === data.ravel['1'].letters[Number(label)]}
                              +{data.ravel['1'].letters[Number(label)]}
                            {:else if data.ravel['1'].letters[truth] !== data.ravel['1'].letters[Number(label)]}
                              -{data.ravel['1'].letters[Number(label)]}
                            {/if}
                          </div>
                          {#each col as row, pred}
                            <div
                              class={cn(
                                'h-10 w-10 items-center justify-center flex border border-border',
                                // TP
                                Number(label) >= 0 &&
                                  pred === Number(label) &&
                                  pred === truth &&
                                  'bg-sky-950 tp',
                                // FN
                                Number(label) >= 0 &&
                                  data.ravel['1'].letters[pred] !==
                                    data.ravel['1'].letters[Number(label)] &&
                                  data.ravel['1'].letters[truth] ===
                                    data.ravel['1'].letters[Number(label)] &&
                                  'bg-sky-800 fn',
                                // FP
                                Number(label) >= 0 &&
                                  data.ravel['1'].letters[pred] ===
                                    data.ravel['1'].letters[Number(label)] &&
                                  data.ravel['1'].letters[truth] !==
                                    data.ravel['1'].letters[Number(label)] &&
                                  'bg-sky-600 fp',
                                // TN,
                                Number(label) >= 0 &&
                                  data.ravel['1'].letters[pred] !==
                                    data.ravel['1'].letters[Number(label)] &&
                                  data.ravel['1'].letters[truth] !==
                                    data.ravel['1'].letters[Number(label)] &&
                                  'bg-sky-400 text-black tn'
                              )}
                            >
                              {row}
                            </div>
                          {/each}
                        </div>
                      {/each}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-4 my-4">
                <div class={!checked ? '' : 'text-muted-foreground'}>Nilai Asli</div>
                <Switch bind:checked />
                <div class={checked ? '' : 'text-muted-foreground'}>Persentase</div>
              </div>
              <Table.Root class="table-fixed">
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Huruf</Table.Head>
                    <Table.Head>
                      <Popover.Root>
                        <Popover.Trigger>F1-Score</Popover.Trigger>
                        <Popover.Content>
                          <Katex math={`\\huge\\frac{2TP}{2TP+FP+FN}`}></Katex>
                        </Popover.Content>
                      </Popover.Root>
                    </Table.Head>
                    <Table.Head
                      ><Popover.Root>
                        <Popover.Trigger>Precission</Popover.Trigger>
                        <Popover.Content>
                          <Katex math={`\\huge\\frac{TP}{TP+FP}`}></Katex>
                        </Popover.Content>
                      </Popover.Root>
                    </Table.Head>
                    <Table.Head
                      ><Popover.Root>
                        <Popover.Trigger>Recall</Popover.Trigger>
                        <Popover.Content>
                          <Katex math={`\\huge\\frac{TP}{TP+FN}`}></Katex>
                        </Popover.Content>
                      </Popover.Root>
                    </Table.Head>
                    <Table.Head>Support</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {#each data.cm_report1 as cm_report}
                    {#if cm_report['value']}
                      <Table.Row>
                        <Table.Cell class="letter capitalize w-full">
                          <Popover.Root>
                            <Popover.Trigger class="capitalize">{cm_report.letter}</Popover.Trigger>
                            <Popover.Content>
                              <Katex math={`\\huge\\frac{TP+TN}{TP+TN+FP+FN}`}></Katex>
                            </Popover.Content>
                          </Popover.Root>
                        </Table.Cell>
                        <Table.Cell colSpan={4} class="capitalize w-full text-center"
                          >{checked ? percentage(cm_report.value) : cm_report.value}</Table.Cell
                        >
                      </Table.Row>
                    {:else}
                      <Table.Row>
                        <Table.Cell class="letter capitalize">{cm_report.letter}</Table.Cell>
                        <Table.Cell
                          >{checked
                            ? percentage(cm_report['f1-score'])
                            : cm_report['f1-score']}</Table.Cell
                        >
                        <Table.Cell
                          >{checked
                            ? percentage(cm_report.precision)
                            : cm_report.precision}</Table.Cell
                        >
                        <Table.Cell
                          >{checked ? percentage(cm_report.recall) : cm_report.recall}</Table.Cell
                        >
                        <Table.Cell>{cm_report.support}</Table.Cell>
                      </Table.Row>
                    {/if}
                  {/each}
                </Table.Body>
              </Table.Root>
            </div>
          </Card.Content>
        </Card.Root>
      </Tabs.Content>
      <Tabs.Content value="2">
        <Card.Root>
          <Card.Header>
            <Card.Title>Gambar 2 Tangan</Card.Title>
          </Card.Header>
          <Card.Content class="space-y-2">
            <div class="space-y-4">
              <img alt={'cm-2'} src={data.cm_image[2]} />
              <div class="flex items-center gap-4 my-4">
                <div class={!checked ? '' : 'text-muted-foreground'}>Nilai Asli</div>
                <Switch bind:checked />
                <div class={checked ? '' : 'text-muted-foreground'}>Persentase</div>
              </div>
              <Table.Root class="table-fixed">
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Huruf</Table.Head>
                    <Table.Head>F1-Score</Table.Head>
                    <Table.Head>Precission</Table.Head>
                    <Table.Head>Recall</Table.Head>
                    <Table.Head>Support</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {#each data.cm_report2 as cm_report}
                    {#if cm_report['value']}
                      <Table.Row>
                        <Table.Cell class="letter capitalize w-full">{cm_report.letter}</Table.Cell>
                        <Table.Cell colSpan={4} class="capitalize w-full text-center"
                          >{checked ? percentage(cm_report.value) : cm_report.value}</Table.Cell
                        >
                      </Table.Row>
                    {:else}
                      <Table.Row>
                        <Table.Cell class="capitalize">{cm_report.letter}</Table.Cell>
                        <Table.Cell
                          >{checked
                            ? percentage(cm_report['f1-score'])
                            : cm_report['f1-score']}</Table.Cell
                        >
                        <Table.Cell
                          >{checked
                            ? percentage(cm_report.precision)
                            : cm_report.precision}</Table.Cell
                        >
                        <Table.Cell
                          >{checked ? percentage(cm_report.recall) : cm_report.recall}</Table.Cell
                        >
                        <Table.Cell>{cm_report.support}</Table.Cell>
                      </Table.Row>
                    {/if}
                  {/each}
                </Table.Body>
              </Table.Root>
            </div>
          </Card.Content>
        </Card.Root>
      </Tabs.Content>
    </Tabs.Root>
  </div>
  <div class="mt-4">
    Jumlah data <a href="/report/count" class="cursor-pointer hover:text-sky-500 hover:underline"
      >klik disini</a
    >
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

  .truelabel {
    writing-mode: vertical-rl;
    text-orientation: upright;
  }
</style>
