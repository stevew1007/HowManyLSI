import "server-only";
import { FetchError, apiClient } from "./apiClient";
import z from "zod";

const defaultQuery = "datasource=tranquility";

export const skillCategorySchema = z.object({
  category_id: z.number().int(),
  groups: z.array(z.number().int()).max(1000),
  name: z.string(),
  published: z.boolean(),
});

export async function fetchSkillCategory(): Promise<
  { error: string } | { groups: number[] }
> {
  const skillGropId = 16;
  try {
    const response = await apiClient.get(
      `/universe/categories/${skillGropId}/?${defaultQuery}`,
    );
    const ret = (await response.json()) as z.infer<typeof skillCategorySchema>;
    const data = skillCategorySchema.parse(ret);
    if (data.name !== "Skill") {
      return { error: "Incorret category" };
    } else {
      return { groups: data.groups };
    }
  } catch (error) {
    if (error instanceof FetchError) {
      //   switch (error.response.status) {
      //     case 404:
      //       return { error: "Forbidden" };
      //     case 404:
      //       return { error: "Not found" };
      //     default:
      //       return { error: error.message };
      //   }
      return {
        error: `Network error ${error.response.status}: ${error.message}`,
      };
    } else if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Unknown error" };
    }
  }
}

export const groupSchema = z.object({
  category_id: z.number().int(),
  group_id: z.number().int(),
  name: z.string(),
  published: z.boolean(),
  types: z.array(z.number().int()).max(1000),
});

export async function fetchGroup(
  groupId: number,
): Promise<{ error: string } | z.infer<typeof groupSchema>> {
  try {
    const response = await apiClient.get(
      `/universe/groups/${groupId}/?${defaultQuery}`,
    );
    const ret = (await response.json()) as z.infer<typeof groupSchema>;
    return groupSchema.parse(ret);
  } catch (error) {
    if (error instanceof FetchError) {
      switch (error.response.status) {
        case 404:
          return { error: `Cannot find group ${groupId}` };
        case 420:
          return { error: "Rate limited by server" };
        default:
          return { error: `Network error: ${error.message}` };
      }
    } else if (error instanceof Error) {
      return { error: `Internal error: ${error.message}` };
    } else {
      return { error: "Unknown error" };
    }
  }
}

export const typeSchema = z.object({
  capacity: z.number().optional(),
  description: z.string(),
  dogma_attributes: z
    .array(
      z.object({
        attribute_id: z.number().int(),
        value: z.number(),
      }),
    )
    .max(1000)
    .optional(),
  dogma_effects: z
    .array(
      z.object({
        effect_id: z.number().int(),
        is_default: z.boolean(),
      }),
    )
    .max(1000)
    .optional(),
  graphic_id: z.number().int().optional(),
  group_id: z.number().int(),
  icon_id: z.number().int().optional(),
  market_group_id: z.number().int().optional(),
  mass: z.number().optional(),
  name: z.string(),
  packaged_volume: z.number().optional(),
  portion_size: z.number().int().optional(),
  published: z.boolean(),
  radius: z.number().optional(),
  type_id: z.number().int(),
  volume: z.number().optional(),
});

export async function fetchType(
  typeId: number,
): Promise<{ error: string } | z.infer<typeof typeSchema>> {
  try {
    const response = await apiClient.get(
      `/universe/types/${typeId}/?${defaultQuery}`,
    );
    const ret = (await response.json()) as z.infer<typeof typeSchema>;
    return typeSchema.parse(ret);
  } catch (error) {
    if (error instanceof FetchError) {
      switch (error.response.status) {
        case 404:
          return { error: `Cannot find type ${typeSchema}` };
        case 420:
          return { error: "Rate limited by server" };
        default:
          return { error: `Network error: ${error.message}` };
      }
    } else if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Unknown error" };
    }
  }
}
