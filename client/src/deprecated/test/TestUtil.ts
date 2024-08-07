export class TestUtil {
    static getTestServer() : string {
        return 'http://localhost:8081/';
    }

    static getTestConfiguration() : any {
        return {
            server: TestUtil.getTestServer(),
            writingPosition: ['house1']
        };
    }
}