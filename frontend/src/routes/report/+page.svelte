<script lang="ts">
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import * as Card from '$lib/components/ui/card';
  import * as Table from '$lib/components/ui/table/index.js';
  import type { PageData } from './$types';

  export let data: PageData;

  let value = 'cm1';
</script>

<main class="mt-8 pt-2 sm:container mx-2 sm:mx-auto pb-10">
  <h1 class="text-center mt-2">Report</h1>
  <div class="flex flex-col items-center justify-center w-full">
    <Tabs.Root
      {value}
      class="w-full"
      onValueChange={(v) => {
        value = v ?? 'cm1';
      }}
    >
      <Tabs.List class="grid w-full grid-cols-2">
        <Tabs.Trigger value="cm1">CM 1 Tangan</Tabs.Trigger>
        <Tabs.Trigger value="cm2">CM 2 Tangan</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="cm1">
        <Card.Root>
          <Card.Header>
            <Card.Title>Gambar 1 Tangan</Card.Title>
          </Card.Header>
          <Card.Content class="space-y-2">
            <div class="space-y-1">
              <img src={data.cm_image[1]} />
              <Table.Root>
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
                  {#each data.cm_report1 as cm_report}
                    {#if cm_report['value']}
                      <Table.Row>
                        <Table.Cell class="capitalize w-full">{cm_report.letter}</Table.Cell>
                        <Table.Cell colSpan={4} class="capitalize w-full text-center"
                          >{cm_report.value}</Table.Cell
                        >
                      </Table.Row>
                    {:else}
                      <Table.Row>
                        <Table.Cell class="capitalize">{cm_report.letter}</Table.Cell>
                        <Table.Cell>{cm_report['f1-score']}</Table.Cell>
                        <Table.Cell>{cm_report.precision}</Table.Cell>
                        <Table.Cell>{cm_report.recall}</Table.Cell>
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
      <Tabs.Content value="cm2">
        <Card.Root>
          <Card.Header>
            <Card.Title>Gambar 2 Tangan</Card.Title>
          </Card.Header>
          <Card.Content class="space-y-2">
            <div class="space-y-1">
              <img src={data.cm_image[2]} />
              <Table.Root>
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
                        <Table.Cell class="capitalize w-full">{cm_report.letter}</Table.Cell>
                        <Table.Cell colSpan={4} class="capitalize w-full text-center"
                          >{cm_report.value}</Table.Cell
                        >
                      </Table.Row>
                    {:else}
                      <Table.Row>
                        <Table.Cell class="capitalize">{cm_report.letter}</Table.Cell>
                        <Table.Cell>{cm_report['f1-score']}</Table.Cell>
                        <Table.Cell>{cm_report.precision}</Table.Cell>
                        <Table.Cell>{cm_report.recall}</Table.Cell>
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
