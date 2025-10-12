import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { streamToString } from '@/services/lib';
import { PortalConfig } from '@/types/config';
import { PORTAL_HOST } from '@/utils/store-keys';

const configPath = path.join(process.cwd(), "config", "config.json");

export async function POST(req: NextRequest) {
    const data = await streamToString(req.body)
    fs.writeFileSync(configPath, data, "utf-8");
    return NextResponse.json(
        { data: 'test' },
        { status: 200 }
    )
}

export async function GET(req: NextRequest) {
    try {
        const configPath = path.join(process.cwd(), "config", "config.json");
        const fileContent = fs.readFileSync(configPath, "utf-8");
        const config: PortalConfig = JSON.parse(fileContent);

        const host = req.headers.get('host') || "";
        const host_url_enc = req.cookies.get(PORTAL_HOST.replace("-", "_"));

        let changed = false;
        const cookieKey = PORTAL_HOST.replace("-", "_");
        const cookieValue = encodeURIComponent(config.dbs[host].url);

        if (!host_url_enc || host_url_enc.value === 'undefined') {
            changed = true;
        } else {
            const host_url = decodeURIComponent(host_url_enc.value);
            if (host_url !== config.dbs[host].url) {
                // console.log('ConfigChanged', {
                //     NewConfig: config.dbs[host].url,
                //     OldConfig: host_url,
                //     condition: host_url !== config.dbs[host].url
                // });
                changed = true;
            }
        }

        const response = NextResponse.json({ config: config.dbs[host], changed });

        if (changed) {
            response.cookies.set(cookieKey, cookieValue, {
                httpOnly: true,
                maxAge: 3600 * 24 * 14, // 14 days
                path: '/',
                sameSite: 'strict'
            });
        }

        return response;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Unable to find config file' }, { status: 500 });
    }
}

