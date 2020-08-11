import numpy as np
# --
from rl_glue import RLGlue
# --
from agent import TDAgent 
from environment import GridEnvironment


def run_experiment(env_info, agent_info, 
                   num_episodes=5000,
                   value_error_threshold=1e-8,
                   plot_freq=10):
    env = GridEnvironment
    agent = TDAgent
    rl_glue = RLGlue(env, agent)

    rl_glue.rl_init(agent_info, env_info)
    steps = []
    for episode in range(1, num_episodes + 1):
        rl_glue.rl_episode(0) # no step limit
        steps.append(rl_glue.agent.agent_message("get_steps"))
        if episode % plot_freq == 0:
            values = rl_glue.agent.agent_message("get_values")
            print(rl_glue.environment.env_message("get_grid_state"))
        rl_glue.rl_cleanup()
    values = rl_glue.agent.agent_message("get_values")
    
    return [values, steps]

size = 2
length = size * size
env_info = {
    "grid_size": size, 
    "grid_length": length, 
    "seed": 0, 
    "grid_state": np.zeros(length).astype(int), 
    "grid": np.zeros(length).astype(int)
}
agent_info = {
    "discount": 1, 
    "step_size": 0.01, 
    "seed": 0,
    "epsilon": 0.01,
}

policy = np.ones(shape=(pow(2, env_info['grid_length']), env_info['grid_length'])) / length

agent_info.update({"policy": policy})
result = run_experiment(env_info, agent_info, num_episodes=5000)
print(result[1])
