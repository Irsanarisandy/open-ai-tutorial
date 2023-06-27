# Using custom model for chatbots

## Convert CSV to JSONL

1. Install Python 3 and make sure to upgrade pip to the latest version.
2. Go to terminal and install relevant packages using pip: `pip install openai pandas`.
3. Export the key: `export OPENAI_API_KEY=<KEY>`.
4. Convert the chosen CSV file: `openai tools fine_tunes.prepare_data -f <FILENAME>.csv`.

## What is n_epochs

- It controls the number of times OpenAI will cycle through the training data set.
- Optional flag, defaults to 4.
- Higher numbers = higher cost.

## Fine-tuning the data model ([guide](https://platform.openai.com/docs/guides/fine-tuning))

- Go to terminal and run `openai api fine_tunes.create -t <FILENAME>.jsonl -m <base_model> <optional flags and values>`, e.g. `openai api fine_tunes.create -t test.jsonl -m davinci --n_epochs 16`.
- To reconnect the stream (to check how the fine-tune is progressing or see if it is completed) run `openai api fine_tunes.follow -i <FINE_TUNE_JOB_ID>`, e.g. `openai api fine_tunes.follow -i ft-bfubdoni4737dbsj`.
- To list all created fine-tune models, run `openai api fine_tunes.list`.
- To delete a fine-tune model, run `openai api models.delete -i <FINE_TUNE_MODEL>`, e.g. `openai api models.delete -i davinci:ft-test`.

## Use generated fine-tune model

- Instead of using chat, change to completion and set the model to be the one generated after fine-tuning, for example in JavaScript/TypeScript:

```typescript
openai.createCompletion({
  model: "davinci:ft-test",
  stream: true,
  prompt: event.body,
  presence_penalty: 0,
  frequency_penalty: 0.3,
  max_token: 1000,
  // stops completion when detect certain character
  stop: ["\n", "->"],
});
```
