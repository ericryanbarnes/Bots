import { SlashCommandBuilder } from "@discordjs/builders";

const enrollCMD = new SlashCommandBuilder()
  .setName("enrollment")
  .setDescription("Enter your information to enroll in the club, use TAB to switch between fields.")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Please enter your first and last name.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("email")
      .setDescription("Please enter your student email.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("interests")
      .setDescription("Please enter your specific interests or specializations!")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("add_to_email_distro")
      .setDescription("Be added to the email list?")
      .setRequired(true)
      .setChoices(
        {
          name: "yes",
          value: "yes",
        },
        {
          name: "no",
          value: "no",
        }
      )
  );

export default enrollCMD.toJSON();
