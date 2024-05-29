import { ClickHouseClient, createClient } from '@clickhouse/client';
import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthCheckResult, HealthCheckService, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HealthService extends HealthIndicator {

	constructor(
		private readonly health: HealthCheckService,
		private readonly prismaService: PrismaService,
	) {
		super();
		this.clickhouse = createClient({
			host: process.env.CLICKHOUSE_HOST,
			username: process.env.CLICKHOUSE_USER,
			password: process.env.CLICKHOUSE_PASSWORD,
			database: process.env.CLICKHOUSE_DB
		});
	}

	private clickhouse: ClickHouseClient;

	async checkHealth(): Promise<HealthCheckResult> {
		return this.health.check([
			() => this.checkDatabaseHealth(),
			() => this.checkClickhouseHealth()
		])
	}

	async checkDatabaseHealth(): Promise<HealthIndicatorResult> {
		try {
			await this.prismaService.$executeRaw`SELECT 1`;
			return this.getStatus('Postgres', true, {
				name: 'Postgres',
				type: 'internal',
				impactMessage: 'Service will not be able to fetch/save event schema',
				status: {
					isAvailable: true
				},
				sla: {
					timeForResolutionInMinutes: 60,
					priority: 0
				}
			})
		} catch (e) {
			throw new HealthCheckError("PrismaService failed to connect!", this.getStatus('Postgres', false, {
				name: 'Postgres',
				type: 'internal',
				impactMessage: 'Service will not be able to fetch/save event schema',
				status: {
					isAvailable: false,
					error: e.message
				},
				sla: {
					timeForResolutionInMinutes: 60,
					priority: 0
				}
			}));
		}
	}

	async checkClickhouseHealth(): Promise<HealthIndicatorResult> {
		try {
			await this.clickhouse.query({ query: `SELECT 1;` })
			return this.getStatus('Clickhouse', true, {
				name: 'Clickhouse',
				type: 'internal',
				impactMessage: 'Service will not be able to save events to database',
				status: {
					isAvailable: true
				},
				sla: {
					timeForResolutionInMinutes: 60,
					priority: 0
				}
			});
		} catch (e) {
			throw new HealthCheckError("Clickhouse failed to connect!", this.getStatus('Clickhouse', false, {
				name: 'Clickhouse',
				type: 'internal',
				impactMessage: 'Service will not be able to save events to database',
				status: {
					isAvailable: false,
					error: e.message
				},
				sla: {
					timeForResolutionInMinutes: 60,
					priority: 0
				}
			}));
		}
	}

	async pingCheck(): Promise<HealthCheckResult> {
		const resp: HealthCheckResult = {
			status: 'ok',
			details: {
				"telemetry": {
					"status": "up"
				}
			},
		};
		return resp;
	}
}
