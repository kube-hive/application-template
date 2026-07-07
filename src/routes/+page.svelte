<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Field from "$lib/components/ui/field/index.js";

    import { computePost } from "./compute.remote";
</script>

<div class="flex min-h-svh items-center justify-center p-4">
    <Card.Root class="w-full max-w-sm">
        <Card.Header>
            <Card.Title>Compute</Card.Title>
            <Card.Description>Enter two numbers to compute their sum on the server.</Card.Description>
        </Card.Header>
        <Card.Content>
            <form {...computePost} class="flex flex-col gap-4">
                <Field.Group>
                    <Field.Field>
                        <Field.Label for="a">Number A</Field.Label>
                        <Input id="a" {...computePost.fields.a.as('number')} placeholder="0" />
                        {#each computePost.fields.a.issues() ?? [] as issue}
                            <Field.Error>{issue.message}</Field.Error>
                        {/each}
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="b">Number B</Field.Label>
                        <Input id="b" {...computePost.fields.b.as('number')} placeholder="0" />
                        {#each computePost.fields.b.issues() ?? [] as issue}
                            <Field.Error>{issue.message}</Field.Error>
                        {/each}
                    </Field.Field>
                </Field.Group>

                <Button type="submit" disabled={!!computePost.pending}>
                    {computePost.pending ? 'Computing...' : 'Compute'}
                </Button>

                {#if computePost.result != null}
                    <div class="rounded-md border bg-muted/50 p-3 text-center text-sm">
                        Result: <span class="font-semibold">{computePost.result}</span>
                    </div>
                {/if}
            </form>
        </Card.Content>
    </Card.Root>
</div>
