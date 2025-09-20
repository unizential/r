import { CodeMasterAgent } from './code-master.js'
import { ScriptDoctorAgent } from './script-doctor.js'
import { TestBotAgent } from './test-bot.js'

export const agents = {
  code_master: new CodeMasterAgent(),
  script_doctor: new ScriptDoctorAgent(),
  test_bot: new TestBotAgent(),
}


