export const pagesProject = {
  id: '7b162ea7-7367-4d67-bcde-1160995d5',
  build_config: {
    build_caching: true,
    build_command: 'npm run build',
    destination_dir: 'build',
    root_dir: '/',
    web_analytics_tag: 'cee1c73f6e4743d0b5e6bb1a0bcaabcc',
    web_analytics_token: '021e1057c18547eca7b79f2516f06o7x',
  },
  canonical_deployment: {
    id: 'f64788e9-fccd-4d4a-a28a-cb84f88f6',
    aliases: ['https://branchname.projectname.pages.dev'],
    build_config: {
      build_caching: true,
      build_command: 'npm run build',
      destination_dir: 'build',
      root_dir: '/',
      web_analytics_tag: 'cee1c73f6e4743d0b5e6bb1a0bcaabcc',
      web_analytics_token: '021e1057c18547eca7b79f2516f06o7x',
    },
    created_on: '2021-03-09T00:55:03.923456Z',
    deployment_trigger: {
      metadata: {
        branch: 'main',
        commit_hash: 'ad9ccd918a81025731e10e40267e11273a263421',
        commit_message: 'Update index.html',
      },
      type: 'ad_hoc',
    },
    env_vars: {
      BUILD_VERSION: {
        value: '3.3',
        type: 'type',
      },
      ENV: {
        value: 'STAGING',
        type: 'type',
      },
    },
    environment: 'preview',
    is_skipped: true,
    latest_stage: {
      ended_on: '2021-03-09T00:58:59.045655Z',
      name: 'deploy',
      started_on: '2021-03-09T00:55:03.923456Z',
      status: 'success',
    },
    modified_on: '2021-03-09T00:58:59.045655Z',
    project_id: '7b162ea7-7367-4d67-bcde-1160995d5',
    project_name: 'ninjakittens',
    short_id: 'f64788e9',
    source: {
      config: {
        deployments_enabled: true,
        owner: 'owner',
        path_excludes: ['string'],
        path_includes: ['string'],
        pr_comments_enabled: true,
        preview_branch_excludes: ['string'],
        preview_branch_includes: ['string'],
        preview_deployment_setting: 'all',
        production_branch: 'production_branch',
        production_deployments_enabled: true,
        repo_name: 'repo_name',
      },
      type: 'type',
    },
    stages: [
      {
        ended_on: '2021-06-03T15:39:03.134378Z',
        name: 'queued',
        started_on: '2021-06-03T15:38:15.608194Z',
        status: 'active',
      },
      {
        ended_on: null,
        name: 'initialize',
        started_on: null,
        status: 'idle',
      },
      {
        ended_on: null,
        name: 'clone_repo',
        started_on: null,
        status: 'idle',
      },
      {
        ended_on: null,
        name: 'build',
        started_on: null,
        status: 'idle',
      },
      {
        ended_on: null,
        name: 'deploy',
        started_on: null,
        status: 'idle',
      },
    ],
    url: 'https://f64788e9.ninjakittens.pages.dev',
  },
  created_on: '2017-01-01T00:00:00Z',
  deployment_configs: {
    preview: {
      ai_bindings: {
        AI_BINDING: {
          project_id: 'some-project-id',
        },
      },
      analytics_engine_datasets: {
        ANALYTICS_ENGINE_BINDING: {
          dataset: 'api_analytics',
        },
      },
      browsers: {
        BROWSER: {},
      },
      compatibility_date: '2022-01-01',
      compatibility_flags: ['url_standard'],
      d1_databases: {
        D1_BINDING: {
          id: '445e2955-951a-43f8-a35b-a4d0c8138f63',
        },
      },
      durable_object_namespaces: {
        DO_BINDING: {
          namespace_id: '5eb63bbbe01eeed093cb22bb8f5acdc3',
        },
      },
      env_vars: {
        foo: {
          value: 'hello world',
          type: 'plain_text',
        },
      },
      hyperdrive_bindings: {
        HYPERDRIVE: {
          id: 'a76a99bc342644deb02c38d66082262a',
        },
      },
      kv_namespaces: {
        KV_BINDING: {
          namespace_id: '5eb63bbbe01eeed093cb22bb8f5acdc3',
        },
      },
      mtls_certificates: {
        MTLS: {
          certificate_id: 'd7cdd17c-916f-4cb7-aabe-585eb382ec4e',
        },
      },
      placement: {
        mode: 'smart',
      },
      queue_producers: {
        QUEUE_PRODUCER_BINDING: {
          name: 'some-queue',
        },
      },
      r2_buckets: {
        R2_BINDING: {
          jurisdiction: 'eu',
          name: 'some-bucket',
        },
      },
      services: {
        SERVICE_BINDING: {
          entrypoint: 'MyHandler',
          environment: 'production',
          service: 'example-worker',
        },
      },
      vectorize_bindings: {
        VECTORIZE: {
          index_name: 'my_index',
        },
      },
    },
    production: {
      ai_bindings: {
        AI_BINDING: {
          project_id: 'some-project-id',
        },
      },
      analytics_engine_datasets: {
        ANALYTICS_ENGINE_BINDING: {
          dataset: 'api_analytics',
        },
      },
      browsers: {
        BROWSER: {},
      },
      compatibility_date: '2022-01-01',
      compatibility_flags: ['url_standard'],
      d1_databases: {
        D1_BINDING: {
          id: '445e2955-951a-43f8-a35b-a4d0c8138f63',
        },
      },
      durable_object_namespaces: {
        DO_BINDING: {
          namespace_id: '5eb63bbbe01eeed093cb22bb8f5acdc3',
        },
      },
      env_vars: {
        foo: {
          value: 'hello world',
          type: 'plain_text',
        },
      },
      hyperdrive_bindings: {
        HYPERDRIVE: {
          id: 'a76a99bc342644deb02c38d66082262a',
        },
      },
      kv_namespaces: {
        KV_BINDING: {
          namespace_id: '5eb63bbbe01eeed093cb22bb8f5acdc3',
        },
      },
      mtls_certificates: {
        MTLS: {
          certificate_id: 'd7cdd17c-916f-4cb7-aabe-585eb382ec4e',
        },
      },
      placement: {
        mode: 'smart',
      },
      queue_producers: {
        QUEUE_PRODUCER_BINDING: {
          name: 'some-queue',
        },
      },
      r2_buckets: {
        R2_BINDING: {
          jurisdiction: 'eu',
          name: 'some-bucket',
        },
      },
      services: {
        SERVICE_BINDING: {
          entrypoint: 'MyHandler',
          environment: 'production',
          service: 'example-worker',
        },
      },
      vectorize_bindings: {
        VECTORIZE: {
          index_name: 'my_index',
        },
      },
    },
  },
  domains: ['customdomain.com', 'customdomain.org'],
  latest_deployment: {
    id: 'f64788e9-fccd-4d4a-a28a-cb84f88f6',
    aliases: ['https://branchname.projectname.pages.dev'],
    build_config: {
      build_caching: true,
      build_command: 'npm run build',
      destination_dir: 'build',
      root_dir: '/',
      web_analytics_tag: 'cee1c73f6e4743d0b5e6bb1a0bcaabcc',
      web_analytics_token: '021e1057c18547eca7b79f2516f06o7x',
    },
    created_on: '2021-03-09T00:55:03.923456Z',
    deployment_trigger: {
      metadata: {
        branch: 'main',
        commit_hash: 'ad9ccd918a81025731e10e40267e11273a263421',
        commit_message: 'Update index.html',
      },
      type: 'ad_hoc',
    },
    env_vars: {
      BUILD_VERSION: {
        value: '3.3',
        type: 'type',
      },
      ENV: {
        value: 'STAGING',
        type: 'type',
      },
    },
    environment: 'preview',
    is_skipped: true,
    latest_stage: {
      ended_on: '2021-03-09T00:58:59.045655Z',
      name: 'deploy',
      started_on: '2021-03-09T00:55:03.923456Z',
      status: 'success',
    },
    modified_on: '2021-03-09T00:58:59.045655Z',
    project_id: '7b162ea7-7367-4d67-bcde-1160995d5',
    project_name: 'ninjakittens',
    short_id: 'f64788e9',
    source: {
      config: {
        deployments_enabled: true,
        owner: 'owner',
        path_excludes: ['string'],
        path_includes: ['string'],
        pr_comments_enabled: true,
        preview_branch_excludes: ['string'],
        preview_branch_includes: ['string'],
        preview_deployment_setting: 'all',
        production_branch: 'production_branch',
        production_deployments_enabled: true,
        repo_name: 'repo_name',
      },
      type: 'type',
    },
    stages: [
      {
        ended_on: '2021-06-03T15:39:03.134378Z',
        name: 'queued',
        started_on: '2021-06-03T15:38:15.608194Z',
        status: 'active',
      },
      {
        ended_on: null,
        name: 'initialize',
        started_on: null,
        status: 'idle',
      },
      {
        ended_on: null,
        name: 'clone_repo',
        started_on: null,
        status: 'idle',
      },
      {
        ended_on: null,
        name: 'build',
        started_on: null,
        status: 'idle',
      },
      {
        ended_on: null,
        name: 'deploy',
        started_on: null,
        status: 'idle',
      },
    ],
    url: 'https://f64788e9.ninjakittens.pages.dev',
  },
  name: 'NextJS Blog',
  production_branch: 'main',
  source: {
    config: {
      deployments_enabled: true,
      owner: 'owner',
      path_excludes: ['string'],
      path_includes: ['string'],
      pr_comments_enabled: true,
      preview_branch_excludes: ['string'],
      preview_branch_includes: ['string'],
      preview_deployment_setting: 'all',
      production_branch: 'production_branch',
      production_deployments_enabled: true,
      repo_name: 'repo_name',
    },
    type: 'type',
  },
  subdomain: 'helloworld.pages.dev',
}
