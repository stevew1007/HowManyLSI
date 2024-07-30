"use server";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { skillGrops, skills } from "./db/schema";
import { fetchGroup, fetchSkillCategory, fetchType } from "./lib/esiClient";
import rawAttributes from "../data/attributes.json";

type JsonObject = {
  [key: string]: number;
};

function getAttrName(id: number) {
  const obj = rawAttributes as JsonObject;
  return Object.keys(obj).find((key) => obj[key] === id);
}

function getAttrId(name: any) {
  return (rawAttributes as JsonObject)[name];
}

export async function fetchAllSkillGroupsInfo() {
  console.log("fetchAllSkillGroupsInfo started");
  const skills = await fetchSkillCategory();
  //   console.log("skills::: ", skills);

  if ("error" in skills) {
    console.log(`Failed to fetch skill group list, error: ${skills.error}`);
    throw Error(`Failed to fetch skill group list, error: ${skills.error}`);
  }
  //   console.log("skills::: ", skills);

  //   let groups = [];
  for (const groupId of skills.groups) {
    // console.log(`Search for group: ${groupId}`);
    const skillGroupInfo = await fetchGroup(groupId);
    if ("error" in skillGroupInfo) {
      console.log(
        `Failed to fetch info for group ${groupId}: ${skillGroupInfo.error}`,
      );
      throw Error(
        `Failed to fetch info for group ${groupId}: ${skillGroupInfo.error}`,
      );
    }
    // groups.push(skillGroupInfo);

    // Check if the group already exists
    const existingGroup = await db.query.skillGrops.findMany({
      where: (model, { eq }) => eq(model.id, skillGroupInfo.group_id),
    });
    // console.log("existingGroup::: ", existingGroup);
    if (existingGroup.length === 0) {
      // If not, insert it
      console.log("New group found, updating into database");
      await db.insert(skillGrops).values({
        id: skillGroupInfo.group_id,
        name: skillGroupInfo.name,
        published: skillGroupInfo.published,
        skillList: skillGroupInfo.types,
      });
    }
    // console.log("skillGroupInfo::: ", skillGroupInfo);
  }
  //   console.log("groups::: ", groups);
  //   console.log("Group Names: ");
  //   for (const groupInfo of groups) {
  //     console.log(`-${groupInfo.name}: ${groupInfo.types}`);
  //   }
  //   return groups;
}

export async function fetchAllSkillInfo() {
  await fetchAllSkillGroupsInfo();
  // Get the skill groups id from the database
  const skillGroups = await db.query.skillGrops.findMany();

  console.log("Searching: ");
  for (const group of skillGroups) {
    console.log(`Search for group: ${group.id}:${group.name}`);
    for (const skill of group.skillList) {
      console.log(`Search for skill ${skill}`);
      const existingSkill = await db.query.skills.findMany({
        where: (model, { eq }) => eq(model.id, skill),
      });

      const skillInfo = await fetchType(skill);
      if ("error" in skillInfo) {
        console.log(
          `Failed to fetch info for skill ${skill}: ${skillInfo.error}`,
        );
        throw Error(
          `Failed to fetch info for skill ${skill}: ${skillInfo.error}`,
        );
      }
      console.log(`Found skill ${skill}: ${skillInfo.name}`);
      // console.log("skillInfo::: ", skillInfo);

      // Check if the skill already exists
      if (existingSkill.length === 0) {
        console.log("New skill found, updating into database");
        // console.log("skillInfo::: ", skillInfo);
        // Pre-process
        let attributes = {
          primary_attribute: "",
          secondary_attribute: "",
          training_multiplier: 0,
          skill_level: 0,
          omega_skill: false,
        };
        if (skillInfo.dogma_attributes) {
          for (const item of skillInfo.dogma_attributes) {
            switch (item.attribute_id) {
              case getAttrId("primary_attribute"):
                attributes["primary_attribute"] = getAttrName(item.value)!;
                break;
              case getAttrId("secondary_attribute"):
                attributes["secondary_attribute"] = getAttrName(item.value)!;
                break;
              case getAttrId("skill_level"):
                attributes["skill_level"] = item.value;
                break;
              case getAttrId("training_multiplier"):
                attributes["training_multiplier"] = item.value;
                break;
              case getAttrId("omega_skill"):
                attributes["omega_skill"] = item.value === 0;
                break;
              default:
                const attr = getAttrName(item.attribute_id);
                if (attr === undefined) {
                  console.log("Unknown attribute: ", item.attribute_id);
                }
            }
          }
        }
        await db.insert(skills).values({
          id: skillInfo.type_id,
          name: skillInfo.name,
          primaryAttribute: attributes["primary_attribute"],
          secondaryAttribute: attributes["secondary_attribute"],
          skillLevel: attributes["skill_level"],
          trainingMultiplier: attributes["training_multiplier"],
          isOmegaOnly: attributes["omega_skill"],
          groupId: skillInfo.group_id,
          icon: `https://image.eveonline.com/types/${skillInfo.type_id}/icon`,
          published: skillInfo.published,
        });
      } else {
        console.log("Skill already exists, skipping");
      }
    }
  }
}
