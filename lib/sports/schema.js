import { z } from "zod";
import { LIDOM_TEAMS } from "./lidom";

const teamNames = LIDOM_TEAMS.map((team) => team.name);

export const LidomResultSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  homeTeam: z.string().min(2).max(80),
  awayTeam: z.string().min(2).max(80),
  homeScore: z.number().int().min(0).max(99),
  awayScore: z.number().int().min(0).max(99),
  stadium: z.string().max(120).optional().default(""),
  status: z.enum(["scheduled", "live", "final", "postponed", "canceled"]),
  featured: z.boolean().optional().default(false),
});

export function assertDistinctTeams(homeTeam, awayTeam) {
  if (homeTeam === awayTeam) {
    throw new Error("Local y visitante no pueden ser el mismo equipo.");
  }
  if (!teamNames.includes(homeTeam) || !teamNames.includes(awayTeam)) {
    throw new Error("Usa los seis equipos oficiales de LIDOM.");
  }
}
