import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: Request) {
  // custom prompt is a stringified object
  const { prompt } = await req.json();
  const custAttributes = JSON.parse(prompt);

  let response = new Response();

  switch (custAttributes.type) {
    case "reply":
      if (custAttributes.outline == null) {
        console.error("Completion for reply is missing outline!");
        return;
      }
      response = await openai.createCompletion({
        model: "text-davinci-003",
        stream: true,
        prompt: `Generate a short message to enthusiastically say an outline sounds interesting and that you need some minutes to think about it.

        outline: Two dogs fall in love and move to Hawaii to learn to surf.
        message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
        outline: A plane crashes in the jungle and the passengers have to walk 1000km to safety.
        message: I'll spend a few moments considering that. But I love your idea!! A disaster movie in the jungle!
        outline: A group of corrupt lawyers try to send an innocent woman to jail.
        message: Wow that is awesome! Corrupt lawyers, huh? Give me a few moments to think!
        outline: ${custAttributes.outline}
        message:
        `,
        max_tokens: 60,
      });
      break;
    case "synopsis":
      if (custAttributes.outline == null) {
        console.error("Completion for synopsis is missing outline!");
        return;
      }
      response = await openai.createCompletion({
        model: "text-davinci-003",
        stream: true,
        prompt: `Generate an engaging, professional and marketable movie synopsis based on an outline. The synopsis should include actors names in brackets after each character. Choose actors that would be ideal for this role.

        outline: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
        synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
        outline: ${custAttributes.outline}
        synopsis:
        `,
        max_tokens: 700,
      });
      break;
    case "title":
      if (custAttributes.synopsis == null) {
        console.error("Completion for title is missing synopsis!");
        return;
      }
      response = await openai.createCompletion({
        model: "text-davinci-003",
        stream: true,
        prompt: `Generate a catchy movie title for this synopsis: ${custAttributes.synopsis}`,
        max_tokens: 25,
        temperature: 0.7,
      });
      break;
    case "stars":
      if (custAttributes.synopsis == null) {
        console.error("Completion for stars is missing synopsis!");
        return;
      }
      response = await openai.createCompletion({
        model: "text-davinci-003",
        stream: true,
        prompt: `Extract the names in brackets from the synopsis.

        synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
        names: Tom Cruise, Val Kilmer, Kelly McGillis
        synopsis: ${custAttributes.synopsis}
        names:
        `,
        max_tokens: 30,
      });
      break;
    case "imagePrompt":
      if (custAttributes.title == null || custAttributes.synopsis == null) {
        console.error(
          "Completion for imagePrompt is either missing title or synopsis!"
        );
        return;
      }
      response = await openai.createCompletion({
        model: "text-davinci-003",
        stream: true,
        prompt: `Give a short description of an image which could be used to advertise a movie based on a title and synopsis. The description should be rich in visual detail but contain no names.

        title: Love's Time Warp
        synopsis: When scientist and time traveller Wendy (Emma Watson) is sent back to the 1920s to assassinate a future dictator, she never expected to fall in love with them. As Wendy infiltrates the dictator's inner circle, she soon finds herself torn between her mission and her growing feelings for the leader (Brie Larson). With the help of a mysterious stranger from the future (Josh Brolin), Wendy must decide whether to carry out her mission or follow her heart. But the choices she makes in the 1920s will have far-reaching consequences that reverberate through the ages.
        image description: A silhouetted figure stands in the shadows of a 1920s speakeasy, her face turned away from the camera. In the background, two people are dancing in the dim light, one wearing a flapper-style dress and the other wearing a dapper suit. A semi-transparent image of war is super-imposed over the scene.
        title: zero Earth
        synopsis: When bodyguard Kob (Daniel Radcliffe) is recruited by the United Nations to save planet Earth from the sinister Simm (John Malkovich), an alien lord with a plan to take over the world, he reluctantly accepts the challenge. With the help of his loyal sidekick, a brave and resourceful hamster named Gizmo (Gaten Matarazzo), Kob embarks on a perilous mission to destroy Simm. Along the way, he discovers a newfound courage and strength as he battles Simm's merciless forces. With the fate of the world in his hands, Kob must find a way to defeat the alien lord and save the planet.
        image description: A tired and bloodied bodyguard and hamster standing atop a tall skyscraper, looking out over a vibrant cityscape, with a rainbow in the sky above them.
        title: ${custAttributes.title}
        synopsis: ${custAttributes.synopsis}
        image description:
        `,
        max_tokens: 100,
        temperature: 0.8,
      });
      break;
    case "imageSrc":
      if (custAttributes.imagePrompt == null) {
        console.error("Completion for imageSrc is missing imagePrompt!");
        return;
      }
      const response_format = custAttributes.response_format || "b64_json";
      response = await openai.createImage({
        prompt: `${custAttributes.imagePrompt}. There should be no text in this image.`,
        size: "256x256",
        response_format,
      });
      const imageData = await response.json();
      if (response_format === "url") return imageData.data[0].url;
      return `data:image/png;base64,${imageData.data[0].b64_json}`;
    default:
      console.error("Type of prompt is missing!");
      return;
  }

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
