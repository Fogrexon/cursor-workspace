#!/usr/bin/env node
/**
 * ヘッドレス・バランス調整 CLI
 * 例: npm run balance -- --days 300 --seed 1
 *     npm run balance:json -- --days 500 --seed 42
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { DeepPartial, BalanceConfig } from '../logic/balance';
import { runHeadless, type HeadlessReport } from '../logic/headless';
import { stageLabel } from '../logic/stats';

function parseArgs(argv: string[]): {
  days?: number;
  seed?: number;
  width?: number;
  height?: number;
  secondsPerDay?: number;
  sampleEvery?: number;
  balancePath?: string;
  json: boolean;
} {
  const out: ReturnType<typeof parseArgs> = { json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    const next = () => {
      const v = argv[++i];
      if (v === undefined) throw new Error(`Missing value for ${a}`);
      return v;
    };
    switch (a) {
      case '--json':
        out.json = true;
        break;
      case '--days':
        out.days = Number(next());
        break;
      case '--seed':
        out.seed = Number(next());
        break;
      case '--width':
        out.width = Number(next());
        break;
      case '--height':
        out.height = Number(next());
        break;
      case '--secondsPerDay':
        out.secondsPerDay = Number(next());
        break;
      case '--sampleEvery':
        out.sampleEvery = Number(next());
        break;
      case '--balance':
        out.balancePath = next();
        break;
      default:
        if (a.startsWith('-')) throw new Error(`Unknown flag: ${a}`);
    }
  }
  return out;
}

function loadBalance(path: string): DeepPartial<BalanceConfig> {
  const raw = readFileSync(resolve(path), 'utf8');
  return JSON.parse(raw) as DeepPartial<BalanceConfig>;
}

function formatHuman(report: HeadlessReport): string {
  const { final, summary, stageTransitions, options } = report;
  const lines: string[] = [];
  lines.push('=== City Chill Balance Run ===');
  lines.push(
    `days=${options.days} seed=${options.seed} map=${options.width}x${options.height} spd=${options.secondsPerDay}`,
  );
  lines.push('');
  lines.push(`Final day ${final.day}: ${stageLabel(final.stage)} (${final.stage})`);
  lines.push(
    `  pop=${final.population.toFixed(1)} housing=${final.housing} jobs=${final.jobs} transport=${final.transport}`,
  );
  lines.push(
    `  happiness=${final.happiness.toFixed(1)} budget=${final.budget.toFixed(1)} edu=${final.education.toFixed(1)}`,
  );
  lines.push(
    `  roads=${final.roads} rails=${final.rails} bridges=${final.bridges} buildings=${final.buildings} vehicles=${final.vehicles}`,
  );
  lines.push(`  terrain: forest=${final.forests} water=${final.waters}`);
  lines.push('');
  lines.push('Stage transitions:');
  if (stageTransitions.length === 0) {
    lines.push('  (none)');
  } else {
    for (const t of stageTransitions) {
      lines.push(`  day ${t.day}: ${t.from} → ${t.to}`);
    }
  }
  lines.push('');
  lines.push('Summary:');
  lines.push(`  town@${summary.reachedTownDay ?? '-'} city@${summary.reachedCityDay ?? '-'} metropolis@${summary.reachedMetropolisDay ?? '-'}`);
  lines.push(
    `  happiness ${summary.minHappiness.toFixed(1)}–${summary.maxHappiness.toFixed(1)}  minBudget=${summary.minBudget.toFixed(1)}  bankrupt=${summary.bankrupt}`,
  );
  lines.push(`  avgPopGrowth/day=${summary.avgPopulationGrowth.toFixed(3)}`);
  return lines.join('\n');
}

/** 破産、または人口がほぼ停滞したら失敗 */
function isFailure(report: HeadlessReport): boolean {
  if (report.summary.bankrupt) return true;
  // 最終人口が初期+少し程度、かつ町にも到達していない
  if (
    report.summary.avgPopulationGrowth < 0.02 &&
    report.summary.reachedTownDay === null &&
    report.final.day >= 100
  ) {
    return true;
  }
  return false;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const balance = args.balancePath ? loadBalance(args.balancePath) : undefined;

  const report = runHeadless({
    days: args.days,
    seed: args.seed,
    width: args.width,
    height: args.height,
    secondsPerDay: args.secondsPerDay,
    sampleEvery: args.sampleEvery,
    balance,
  });

  if (args.json) {
    // balance 全体は大きいので options.balance は省略せずそのまま
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatHuman(report));
  }

  if (isFailure(report)) {
    if (!args.json) {
      console.error('\nFAIL: bankrupt or population stalled');
    }
    process.exit(1);
  }
}

main();
