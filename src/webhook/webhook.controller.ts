import { Controller, Post, Get, Body } from '@nestjs/common';
import { AppService } from '../app.service';
import { JwtService } from '@nestjs/jwt';

@Controller('/svt_api/webhook')
export class WebhookController {
    //   constructor(private readonly appService: AppService) {}
    constructor(private readonly jwtService: JwtService) { }
    @Get()
    async handleWebhook(@Body() webhookData: Record<string, any>) {
        console.log('get webhook data')
        console.log(webhookData)
        // Logic to process the webhook data
        return { status: 'ok', success: true, message: 'Webhook processed' };
    }

    @Post()
    async handlePostWebhook(@Body() webhookData: Record<string, any>) {
        console.log('post webhook data')
        console.log(webhookData)
        let dynamicRes = {}
        const functionMap = {
            'sign_in': async () => {
                console.log('Generating JWT for sign_in');
                // Generate a JWT
                const payload = { username: webhookData.username || 'guest' };
                const token = this.jwtService.sign(payload);
                dynamicRes = { token }; // Return the generated token
                return true;
            }
        }
        console.log(webhookData.scope);

        if (functionMap[webhookData.scope]) {
            const res = await functionMap[webhookData.scope]();
            console.log(res);
        } else {
            console.log('Invalid scope');
            return { status: 'error', success: false, message: 'Invalid scope' };
        }
        return { ...{ status: 'ok', success: true, message: 'Post Webhook processed' }, ...dynamicRes };
    }
}
